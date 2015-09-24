'use strict';

module.exports = {
    nodeClick: new CustomEvent('nodeClicked', {
        detail: {
            nodeId: '1234'
        }
    }),
    linkClick: new CustomEvent('linkClicked', {

    })
};