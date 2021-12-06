// Returns the time of the last mined block in seconds
function latestTime () {
    return web3.eth.getBlock('latest').timestamp;
  }

export { latestTime }