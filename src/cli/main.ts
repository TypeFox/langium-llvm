import type { OxProgram } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { OxLanguageMetaData } from '../language/generated/module.js';
import { createOxServices } from '../language/ox-module.js';
import { extractAstNode } from './cli-util.js';
import { generateLLVMIR } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createOxServices(NodeFileSystem).Ox;
    const model = await extractAstNode<OxProgram>(fileName, services);
    const generatedFilePath = generateLLVMIR(model, fileName, opts.destination);
    console.log(chalk.green(`LLVM IR code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = OxLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates LLVM IR code from the source file')
        .action(generateAction);

    program.parse(process.argv);
}
