import type { GitHub } from '@actions/github/lib/utils.js';
import type { Inputs, Result } from '../../types.js';
import { Command } from '../command.js';
export declare class PromoteDemoteAction implements Command {
    api: InstanceType<typeof GitHub>;
    params: Inputs;
    constructor();
    validate(): Promise<void>;
    execute(): Promise<Result>;
}
