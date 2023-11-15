import * as assert from "assert";
import {
    CanIPoseBomb,
    whichDirectionIsAllowed,
    hasBoxToExplose,
    hasBombAround,
    findSafeZone,
    findBoxetoExplode, isBotOnTheEdge
} from "../utils.js";


describe('Comportement du bot en rapport avec les déplacements ', function () {
    const botPosition = [1,1];
    const freeTiles = [[1,0],[0,1],[1,2],[2,1]] // H G B D
    const freeTiles2 = [[2,0],[0,6],[2,1],[3,2],[3,1]] // Diag D _ D _ _

    describe('#whichDirectionIsAllowed()', function () {
        it('should return left when the left tile is grass', function () {
            assert.equal(whichDirectionIsAllowed(botPosition, freeTiles).includes('left'), true)
        })
        it('should return right when the right tile is grass', function () {
            assert.equal(whichDirectionIsAllowed(botPosition, freeTiles).includes('right'), true)
        })
        it('should return top when the top tile is grass', function () {
            assert.equal(whichDirectionIsAllowed(botPosition, freeTiles).includes('top'), true)
        })
        it('should return bottom when the bottom tile is grass', function () {
            assert.equal(whichDirectionIsAllowed(botPosition, freeTiles).includes('bottom'), true)
        })
        it('should not return bottom when the bottom tile is not grass', function () {
            assert.equal(whichDirectionIsAllowed(botPosition, freeTiles2).includes('bottom'), false)
        })
    });

    describe('#CanIPoseBomb()', function () {
        const directionsAllowed = whichDirectionIsAllowed(botPosition, freeTiles);
        const directionsAllowed2 = whichDirectionIsAllowed(botPosition, freeTiles2);
        it('should return false if the bot cannot exit the zone in 2 move', function () {
            assert.equal(CanIPoseBomb(botPosition, freeTiles, directionsAllowed), false)
        })
        it('should return true if the bot can exit the zone in 2 move', function () {
            assert.equal(CanIPoseBomb(botPosition, freeTiles2, directionsAllowed2), true)
        })
    });

    describe('#hasBoxToExplose()', function () {
        it('should return false if the bot has no box around him', function () {
            assert.equal(hasBoxToExplose([0,0],[[1,2]]), false)
        })
        it('should return true if the bot has box around him', function () {
            assert.equal(hasBoxToExplose([0,0],[[1,0]]), true)
        })
    });

    describe('#isBotOnTheEdge()', function () {
        it('should return false if the bot is on the edge of the map', function () {
            assert.equal(isBotOnTheEdge([0,0]), true)
        })
        it('should return false if the bot is on the edge of the map', function () {
            assert.equal(isBotOnTheEdge([9,0]), true)
        })
        it('should return false if the bot is on the edge of the map', function () {
            assert.equal(isBotOnTheEdge([9,5]), true)
        })
        it('should return false if the bot is on the edge of the map', function () {
            assert.equal(isBotOnTheEdge([0,4]), true)
        })
        it('should return false if the bot is on the edge of the map', function () {
            assert.equal(isBotOnTheEdge([1,4]), false)
        })
    });
    describe('#hasBombAround()', function () {
        const bombs = [[1,1],[1,0],[0,1]];
        it('should return true if the bot has bomb under him', function () {
            assert.equal(hasBombAround(botPosition, bombs).includes('on'), true)
        })
        it('should return true if the bot has bomb on top of him', function () {
            assert.equal(hasBombAround(botPosition, bombs).includes('top'), true)
        })
        it('should return true if the bot has bomb on left', function () {
            assert.equal(hasBombAround(botPosition, bombs).includes('left'), true)
        })
        it('should return false if the bot has no bomb on right', function () {
            assert.equal(hasBombAround(botPosition, bombs).includes('right'), false)
        })
    });

    describe('#findSafeZone(bombAround : string[], directionsAllowed : string[])', function () {
        it('should return MOVE right if the bot has bomb on left and the right tile is free', function () {
            assert.equal(findSafeZone(['left'], ['right']), 'MOVE right')
        })
        it('should return MOVE bottom if the bot has bomb on top and left and the bottom tile is free', function () {
            assert.equal(findSafeZone(['top','left'], ['bottom']), 'MOVE bottom')
        })
        it('should return MOVE top if the bot is on bomb and the top tile is free', function () {
            assert.equal(findSafeZone(['on'], ['top']), 'MOVE top')
        })
        it('should return null if the bot has no bomb around him and the top tile is free', function () {
            assert.equal(findSafeZone([], ['top']), null)
        })
    });
});

describe('Recherche de boites a exploser', function () {
    describe('#findBoxetoExplose(boxes : []Array, botPosition: number[])', function () {
        it('should return an array of position line and diag', function () {
            assert.deepEqual(findBoxetoExplode([[5,2],[3,0],[4,5],[4,3],[2,0],[0,2],[3,1],[4,1]], [2,2]), [[3,1],[2,0],[3,0],[0,2],[5,2]])
        })
        it('should return an array of two arrays ', function () {
            assert.deepEqual(findBoxetoExplode([[5,2],[3,0]], [2,2]), [[3,0],[5,2]])
        })
        it('should return an empty array when there are no boxes to explode', function () {
            assert.deepEqual(findBoxetoExplode([], [2,2]), [])
        })
    });
});
