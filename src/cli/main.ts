import type { OxProgram } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { OxLanguageMetaData } from '../language/generated/module.js';
import { createOxServices } from '../language/ox-module.js';
import { extractAstNode, extractDestinationAndName } from './cli-util.js';
import { generateLLVMIR } from './llvm-ir-generator/main.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import * as fs from 'node:fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fsp.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createOxServices(NodeFileSystem).Ox;
    const program = await extractAstNode<OxProgram>(fileName, services);

    const filePathData = extractDestinationAndName(fileName, opts.destination);
    if (!fs.existsSync(filePathData.destination)) {
        fs.mkdirSync(filePathData.destination, { recursive: true });
    }

    const generatedFilePath = `${path.join(filePathData.destination, filePathData.name)}.ll`;
    const fileContent = generateLLVMIR(program, fileName);
    if (fileContent !== 'error') {
        fs.writeFileSync(generatedFilePath, fileContent);
        console.log(chalk.green(`LLVM IR code generated successfully: ${generatedFilePath}`));
    } else {
        console.log(chalk.red('LLVM IR code generation failed!'));
    }
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
