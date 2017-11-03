'use strict';

const traits = require('../symbol-traits');

exports.parse = (walker, node, container, scope, parentSymbol) => {
    /** process 'return a table' situation like:
     *  in 'class.lua'
     *  ```lua
     *  local class = {}
     *  function class:funcA()
     *      ...
     *  end
     *  ...
     *  
     *  return class
     *  ```
     */
    if (container.name === '_G' && node.arguments) {
        let expt = node.arguments[0];
        if (expt.type === 'Identifier') {
            returnIdentifier(expt, walker);
        } else/*  if (expt.type === 'TableConstructorExpression') */ {
            walker.walkNodes(node.arguments, container, scope, parentSymbol, false);
        }
    } else {
        node.arguments && walker.walkNodes(node.arguments, container, scope, parentSymbol, false);
    }
}

function returnIdentifier(expt, walker) {
    let definitions = walker.document.definitions;
    let defs = definitions.filter(d => {
        return d.name === expt.name && d.kind === traits.SymbolKind.class;
    });

    if (defs) {
        walker.document.returns = defs[0];
    }
}

