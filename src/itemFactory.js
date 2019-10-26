class Item {
  constructor(name, gravity, effect, scale, imgUrl) {
    this.Name = name;
    this.Gravity = gravity;
    this.Effect = effect;
    this.scale = scale;
    this.imgUrl = imgUrl;
  }
}

export default function letterFactory (letter, color) {
  const name = `${letter}-${color}`
  const gravity = 0
  const scale = 1
  const imgUrl = `${name}.png`
  const effect = letterEffect
  let letterItem = new Item(name, gravity, effect, scale, imgUrl)

  function letterEffect () {
    if (letter === "N") {
      scoreboard.setText("N") 
    } else if (letter === "S") {
      scoreboard.setText("S")
    }
  }

  return letterItem
}