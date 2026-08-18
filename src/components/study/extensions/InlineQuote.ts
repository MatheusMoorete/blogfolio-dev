import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        inlineQuote: {
            /**
             * Set an inline quote mark
             */
            setInlineQuote: () => ReturnType;
            /**
             * Toggle an inline quote mark
             */
            toggleInlineQuote: () => ReturnType;
            /**
             * Unset an inline quote mark
             */
            unsetInlineQuote: () => ReturnType;
        };
    }
}

export const InlineQuote = Mark.create({
    name: 'inlineQuote',

    parseHTML() {
        return [
            { tag: 'q' },
            { tag: 'span.inline-quote' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['q', mergeAttributes(HTMLAttributes, { class: 'inline-quote' }), 0];
    },

    addCommands() {
        return {
            setInlineQuote:
                () =>
                ({ commands }) => {
                    return commands.setMark(this.name);
                },
            toggleInlineQuote:
                () =>
                ({ commands }) => {
                    return commands.toggleMark(this.name);
                },
            unsetInlineQuote:
                () =>
                ({ commands }) => {
                    return commands.unsetMark(this.name);
                },
        };
    },
});
