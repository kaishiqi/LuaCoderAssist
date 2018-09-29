'use strict';

const { DefinitionContext, definitionProvider } = require('../lib/engine/definition');
const utils_1 = require('./lib/utils');
const langserver_1 = require('vscode-languageserver');

class DefinitionProvider {
    constructor(coder) {
        this.coder = coder;
    }

    provideDefinitions(params) {
        let uri = params.textDocument.uri;
        let position = params.position;
        let document = this.coder.document(uri);
        let ref = utils_1.symbolAtPosition(position, document, { backward: true, forward: true });
        if (ref === undefined) {
            return [];
        }

        let defs = definitionProvider(new DefinitionContext(ref.name, ref.range, uri));

        return defs.filter(d => {
            return d.uri !== null;
        }).map(d => {
            const document = this.coder.document(d.uri);
            const start = document.positionAt(d.location[0]);
            const end = document.positionAt(d.location[1]);
            return {
                uri: d.uri,
                name: d.name,
                range: langserver_1.Range.create(start, end)
            };
        });
    }
};

exports.DefinitionProvider = DefinitionProvider;