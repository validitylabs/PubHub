// tslint:disable
import {ReflectMetadata} from '@nestjs/common';
import {PositionalOptions, Options} from 'yargs';

export const COMMAND_HANDLER_METADATA = '__command-handler-metadata__';
export const COMMAND_ARGS_METADATA = '__command-args-metadata__';
export enum CommandParamTypes {
    POSITIONAL = 'POSITIONAL',
    OPTION = 'OPTION',
    ARGV = 'ARGV'
}

export type CommandParamMetadata<O> = {[type in CommandParamTypes]: ICommandParamMetadataItem<O>[]};
export interface ICommandParamMetadataItem<O> {
    index: number;
    option: O;
}
const createCommandParamDecorator = <O>(paramType: CommandParamTypes) => {
    return (option?: O): ParameterDecorator => (target, key, index) => {
        const params = Reflect.getMetadata(COMMAND_ARGS_METADATA, target[key]) || {};
        Reflect.defineMetadata(
            COMMAND_ARGS_METADATA,
            {
                ...params,
                [paramType]: [...(params[paramType] || []), {index, option}]
            },
            target[key]
        );
    };
};

export interface ICommandMetadata {
    params: CommandParamMetadata<ICommandPositionalOption | ICommandOptionsOption>;
    option: ICommandOption;
}
export interface ICommandOption {
    aliases?: string[] | string;
    command: string[] | string;
    describe?: string | false;
}
export function Command(option: ICommandOption): MethodDecorator {
    return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
        const metadata: ICommandMetadata = {
            params: Reflect.getMetadata(COMMAND_ARGS_METADATA, descriptor.value),
            option
        };

        ReflectMetadata(COMMAND_HANDLER_METADATA, metadata)(target, key, descriptor);
    };
}
export interface ICommandPositionalOption extends PositionalOptions {
    name: string;
}
export const Positional = createCommandParamDecorator<ICommandPositionalOption>(CommandParamTypes.POSITIONAL);

export interface ICommandOptionsOption extends Options {
    name: string;
}
export const Option = createCommandParamDecorator<ICommandOptionsOption>(CommandParamTypes.OPTION);

export const Argv = createCommandParamDecorator(CommandParamTypes.ARGV);
