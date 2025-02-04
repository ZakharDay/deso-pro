function getPublicKeys(element) {
  const publicKeys = []

  const myTokensTable = element
    .querySelector('tbody')
    .getElementsByTagName('tr')

  for (let index = 0; index < myTokensTable.length; index++) {
    const element = myTokensTable[index]
    const profilePic = element.querySelector('td a img')
    const publicKey = /picture\/(.*?)\?/g.exec(profilePic.src)[1]

    publicKeys.push(publicKey)
  }

  return publicKeys
}

export { getPublicKeys }
