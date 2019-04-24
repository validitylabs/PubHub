import {flattenDeep, each} from 'lodash';
import {CommandModule, Argv} from 'yargs';
import {Injectable} from '@nestjs/common';
import {MetadataScanner} from '@nestjs/core/metadata-scanner';
import {ModulesContainer} from '@nestjs/core/injector/modules-container';
import {Injectable as InjectableInterface} from '@nestjs/common/interfaces';
import {
    COMMAND_HANDLER_METADATA,
    ICommandMetadata,
    CommandParamTypes,
    CommandParamMetadata,
    ICommandOptionsOption,
    ICommandPositionalOption,
    ICommandParamMetadataItem
} from './command.decorator';
import {CommandService} from './command.service';

@Injectable()
export class CommandExplorerService {
    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly metadataScanner: MetadataScanner,
        private readonly commandService: CommandService
    ) {}

    explore(): CommandModule[] {
        const components = [...this.modulesContainer.values()].map((module) => module.components);

        return flattenDeep<CommandModule>(components.map((component) => [...component.values()].map(({instance}) => this.filterCommands(instance))));
    }

    protected filterCommands(instance: InjectableInterface) {
        const prototype = Object.getPrototypeOf(instance);
        const components = this.metadataScanner.scanFromPrototype(instance, prototype, (name) => this.extractMetadata(instance, prototype, name));

        return components
            .filter((command) => !!command.metadata)
            .map<CommandModule>((command) => {
                const exec = instance[command.methodName].bind(instance);
                const builder = (yargs: Argv) => {
                    return this.generateCommandBuilder(command.metadata.params, yargs);
                }; // EOF builder

                const handler = async (argv: any) => {
                    const params = this.generateCommandHandlerParams(command.metadata.params, argv);

                    this.commandService.run();
                    const code = await exec(...params);
                    this.commandService.exit(code || 0);
                };

                return {
                    ...command.metadata.option,
                    builder,
                    handler
                };
            });
    }

    // tslint:disable-next-line no-unused
    protected extractMetadata(instance, prototype, methodName: string) {
        const callback = prototype[methodName];
        const metadata: ICommandMetadata = Reflect.getMetadata(COMMAND_HANDLER_METADATA, callback);

        return {
            methodName,
            metadata
        };
    }

    protected iteratorParamMetadata<O>(params: CommandParamMetadata<O>, callback: (item: ICommandParamMetadataItem<O>, key: string) => void) {
        each(params, (param, key) => {
            each(param, (metadata) => callback(metadata, key));
        });
    }

    private generateCommandHandlerParams(params: CommandParamMetadata<ICommandOptionsOption | ICommandPositionalOption>, argv: any) {
        const list = [];

        this.iteratorParamMetadata(params, (item, key) => {
            switch (key) {
                case CommandParamTypes.OPTION:
                    list[item.index] = argv[(item.option as ICommandOptionsOption).name];
                    break;

                case CommandParamTypes.POSITIONAL:
                    list[item.index] = argv[(item.option as ICommandPositionalOption).name];
                    break;

                case CommandParamTypes.ARGV:
                    list[item.index] = argv;
                    break;
                default:
            }
        });

        return list;
    }

    private generateCommandBuilder(params: CommandParamMetadata<ICommandOptionsOption | ICommandPositionalOption>, yargs: Argv) {
        this.iteratorParamMetadata(params, (item, key) => {
            switch (key) {
                case CommandParamTypes.OPTION:
                    yargs.option((item.option as ICommandOptionsOption).name, item.option as ICommandOptionsOption);
                    break;

                case CommandParamTypes.POSITIONAL:
                    yargs.positional((item.option as ICommandPositionalOption).name, item.option as ICommandPositionalOption);
                    break;

                default:
            }
        });

        return yargs;
    }
}
