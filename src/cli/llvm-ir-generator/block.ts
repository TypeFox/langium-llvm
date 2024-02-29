import { OxElement, isVariableDeclaration } from "../../language/generated/ast.js";
import { DI, IR } from "./util.js";
import { generateVariableDeclaration } from "./vardecl.js";

export function generateExpressionBlock(ir: IR, di: DI, elements: OxElement[]) {
    for (const element of elements) {
        if (isVariableDeclaration(element)) {
            generateVariableDeclaration(ir, di, element);
        }
    }
}
