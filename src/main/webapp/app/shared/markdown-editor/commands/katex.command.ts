import { DomainTagCommand } from 'app/shared/markdown-editor/domainCommands/domainTag.command';
import { addTextAtCursor } from 'app/shared/util/markdown-util';

/**
 * Insert a katex compatible formula.
 * Uses an e-function as the example.
 */
export class KatexCommand extends DomainTagCommand {
    buttonIcon = 'equals';
    buttonTranslationString = 'artemisApp.markdownEditor.commands.katex';
    execute(): void {
        const text = `${this.getOpeningIdentifier()}e^{\\frac{1}{4} y^2}${this.getClosingIdentifier()}`;
        addTextAtCursor(text, this.aceEditor);
    }

    getOpeningIdentifier(): string {
        return '$$ ';
    }

    getClosingIdentifier(): string {
        return ' $$';
    }
}
