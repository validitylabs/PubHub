'use strict';

module.exports = {
    extends: ['tslint-xo/space', 'tslint-config-prettier'],
    rules: {
        indent: [true, 'spaces', 4],
        'no-unnecessary-class': false,
        'no-implicit-dependencies': [true, 'dev'],
        'variable-name': [true, 'ban-keywords', 'check-format', 'allow-pascal-case', 'allow-leading-underscore'],
        'interface-name': [true, 'always-prefix']
    }
};
