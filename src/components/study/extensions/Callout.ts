import { Node, mergeAttributes } from '@tiptap/core';

export type CalloutType = 'info' | 'tip' | 'warning' | 'quote';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callout: {
            /**
             * Set a callout block
             */
            setCallout: (attributes?: { type?: CalloutType }) => ReturnType;
            /**
             * Toggle a callout block
             */
            toggleCallout: (attributes?: { type?: CalloutType }) => ReturnType;
            /**
             * Unset a callout block
             */
            unsetCallout: () => ReturnType;
        };
    }
}

export const Callout = Node.create({
    name: 'callout',
    group: 'block',
    content: 'block+',
    defining: true,
    isolating: true,

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: element => element.getAttribute('data-callout-type') || 'info',
                renderHTML: attributes => ({
                    'data-callout-type': attributes.type,
                    class: `retro-callout retro-callout-${attributes.type}`,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-callout-type]',
            },
            {
                tag: 'div.retro-callout',
                getAttrs: (element) => {
                    if (typeof element === 'string') return false;
                    const el = element as HTMLElement;
                    const classList = el.className || '';
                    let type = 'info';
                    if (classList.includes('retro-callout-tip')) type = 'tip';
                    else if (classList.includes('retro-callout-warning')) type = 'warning';
                    else if (classList.includes('retro-callout-quote')) type = 'quote';
                    return { type };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setCallout:
                (attributes) =>
                ({ commands }) => {
                    return commands.wrapIn(this.name, attributes);
                },
            toggleCallout:
                (attributes) =>
                ({ commands }) => {
                    return commands.toggleWrap(this.name, attributes);
                },
            unsetCallout:
                () =>
                ({ commands }) => {
                    return commands.lift(this.name);
                },
        };
    },
});
