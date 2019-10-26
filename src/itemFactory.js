
class Item {
  constructor(name, gravity, effect, scale, imgUrl) {
    this.Name = name;
    this.Gravity = gravity;
    this.Effect = effect;
    this.scale = scale;
    this.imgUrl = imgUrl;
  }
}

const items = {
  letterFactory(letter, color) {
    const name = `${letter}-${color}`
    const gravity = 0
    const scale = 1
    const imgUrl = `${name}.png`
    const effect = letterEffect
    let letterItem = new Item(name, gravity, effect, scale, imgUrl)

    function letterEffect() {
      if (letter === "N") {
        scoreboard.setText("N")
      } else if (letter === "S") {
        scoreboard.setText("S")
      }
    }
  },

  coffeeFactory(coffeeObject) {
    const name = "Coffee"
    const gravity = 0
    const scale = 1
    const imgUrl = "coffee.png"
    const effect = coffeeEffect
    let coffee = new Item(name, gravity, effect, scale, imgUrl)

    function coffeeEffect(coffeeObject) {
      console.log("YOU ARE AMPED!!!")
    }
    return coffee
  }
}

export default items