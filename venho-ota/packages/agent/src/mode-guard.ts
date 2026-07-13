import { modeAllowsWrite } from '@venho/domain';
import { UnauthorizedWriteError,type AgentMode } from '@venho/shared';
export function assertWriteAllowed(mode:AgentMode):void{if(!modeAllowsWrite(mode))throw new UnauthorizedWriteError(mode);}
