import {Module} from '@nestjs/common';
import {UiUserModule} from './ui-user';

const modules = [UiUserModule];

@Module({
    imports: modules,
    exports: modules
})
class UIModule {}

export {UIModule};
