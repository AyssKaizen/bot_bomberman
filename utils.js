import {ACTIONS} from './constans.js'


export const botDirection = (botPosition,direction) => {
    switch (direction){
        case 'top':
            return botPosition[1] - 1
        case 'bottom':
            return botPosition[1] + 1
        case 'right':
            return botPosition[0] + 1
        case 'left':
            return botPosition[0] - 1
        default:
            return null
    }
}

export const whichDirectionIsAllowed = (botPosition,freeTiles) => {
    const directionsAllowed = []
    if(freeTiles.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botPosition[1])){
        directionsAllowed.push('right')
    }
    if(freeTiles.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botPosition[1])){
        directionsAllowed.push('left')
    }
    if(freeTiles.find((item)=> item[0] === botPosition[0] && item[1] === botDirection(botPosition,'top'))){
        directionsAllowed.push('top')
    }
    if(freeTiles.find((item)=> item[0] === botPosition[0] && item[1] ===botDirection(botPosition,'bottom'))){
        directionsAllowed.push('bottom')
    }
    return directionsAllowed;
}

export const CanIPoseBomb = (botPosition, grasses, directionsAllowed) => {
    if(directionsAllowed.includes('right')){
        if(
            grasses.find((item)=> item[0] === botPosition[0] +2 && item[1] === botPosition[1]) // right right
            || grasses.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botDirection(botPosition,'bottom')) // right bottom
            || grasses.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botDirection(botPosition,'top')) // right top
        ){
            return true
        }
    }
    if(directionsAllowed.includes('left')){
        if(
            grasses.find((item)=> item[0] === botPosition[0] -2 && item[1] === botPosition[1]) // gauche gauche
            || grasses.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botDirection(botPosition,'bottom')) // left bottom
            || grasses.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botDirection(botPosition,'top')) // left top
        ){
            return true
        }
    }
    if(directionsAllowed.includes('top')){
        if(
            grasses.find((item)=> item[0] === botPosition[0] && item[1] === botPosition[1] - 2) // top top
            || grasses.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botDirection(botPosition,'top')) // top right
            || grasses.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botDirection(botPosition,'top')) // top left
        ){
            return true
        }
    }
    if(directionsAllowed.includes('bottom')){
        if(
            grasses.find((item)=> item[0] === botPosition[0] && item[1] === botPosition[1] + 2) // bottom bottom
            || grasses.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botDirection(botPosition,'bottom')) // bottom right
            || grasses.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botDirection(botPosition,'bottom')) // bottom left
        ){
            return true
        }
    }
    return false
}
export const hasBoxToExplose = (botPosition, boxes) => {
    if(boxes.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botPosition[1])){
        return true
    }
    if(boxes.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botPosition[1])){
        return true
    }
    if(boxes.find((item)=> item[0] === botPosition[0] && item[1] === botDirection(botPosition,'top'))){
        return true
    }
    return !!boxes.find((item) => item[0] === botPosition[0] && item[1] === botDirection(botPosition, 'bottom'));

}
export const isBotOnTheEdge = (botPosition) => {
    if(botDirection(botPosition,'left') < 0) return true
    if(botDirection(botPosition,'right') > 9) return true
    if(botDirection(botPosition,'top') < 0) return true
    return botDirection(botPosition, 'bottom') > 9;

}
export const hasBombAround = (botPosition,bombs) => {
    const bombsAround = []
    if(bombs.find((item) => item[0] === botPosition[0] && item[1] === botPosition[1])){
        bombsAround.push('on')
    }
    if(bombs.find((item)=> item[0] === botDirection(botPosition,'right') && item[1] === botPosition[1])){
        bombsAround.push('right')
    }
    if(bombs.find((item)=> item[0] === botDirection(botPosition,'left') && item[1] === botPosition[1])){
        bombsAround.push('left')
    }
    if(bombs.find((item)=> item[0] === botPosition[0] && item[1] === botDirection(botPosition,'top'))){
        bombsAround.push('top')
    }
    if(bombs.find((item)=> item[0] === botPosition[0] && item[1] ===botDirection(botPosition,'bottom'))){
        bombsAround.push('bottom')
    }
    return bombsAround;
}

export const findSafeZone = (bombsAround, directionsAllowed) => {
    if(directionsAllowed.includes('right') && (bombsAround.includes('top') || bombsAround.includes('left') || bombsAround.includes('bottom') || bombsAround.includes('on'))){
        return ACTIONS.MOVE_RIGHT
    }
    if(directionsAllowed.includes('left') && (bombsAround.includes('top') || bombsAround.includes('right') || bombsAround.includes('bottom') || bombsAround.includes('on'))){
        return ACTIONS.MOVE_LEFT
    }
    if(directionsAllowed.includes('top') && (bombsAround.includes('left') || bombsAround.includes('right') || bombsAround.includes('bottom') || bombsAround.includes('on'))){
        return ACTIONS.MOVE_TOP
    }
    if(directionsAllowed.includes('bottom') && (bombsAround.includes('left') || bombsAround.includes('right') || bombsAround.includes('top') || bombsAround.includes('on'))){
        return ACTIONS.MOVE_BOTTOM
    }
    return null
}

export const findBoxetoExplode = (boxes, botPostion) => {
        const rangedBoxes = []
        const searchDiag = (level, index) => (
            index === 1 && boxes.find((item) => item[0] === botPostion[0] + 1 && item[1] === botPostion[1] - level
                || index === 2 && item[0] === botPostion[0] + 1 && item[1] === botPostion[1] + level ||
                index === 3 && item[0] === botPostion[0] - 1 && item[1] === botPostion[1] +level
                || index === 4 && item[0] === botPostion[0] - 1 && item[1] === botPostion[1] -level )
        )
        const searchRow = (levelRow, index) => (
            index === 1 && boxes.find((item) => item[0] === botPostion[0] && item[1] === botPostion[1] - levelRow) ||
            index === 2 && boxes.find((item) => item[0] === botPostion[0] + levelRow && item[1] === botPostion[1]) ||
            index === 3 && boxes.find((item) => item[0] === botPostion[0] && item[1] === botPostion[1] + levelRow) ||
            index === 4 && boxes.find((item) => item[0] === botPostion[0] - levelRow && item[1] === botPostion[1])
        )
        for (let i = 1; i < 10 ; i++){
            for(let j=1; j <= 4 ; j++){
                searchRow(i,j) ? rangedBoxes.push(searchRow(i,j)) : null
                searchDiag(i,j) ? rangedBoxes.push(searchDiag(i,j)) : null
            }
        }
    return rangedBoxes
}
