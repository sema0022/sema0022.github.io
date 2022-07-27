/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

// array of 10 words that will be copied and scrambled
const words = [
  'reaction',
  'writing',
  'poem',
  'platform',
  'pie',
  'speech',
  'arrival',
  'diamond',
  'child',
  'soup'
]

// Vue application
const app = Vue.createApp({
  data: function () {
    return {
      maxStrikes: 3,
      // game data
      game: {
        words: words.slice(0), // copy of words array
        word: '', // the current word
        guess: '',
        strikes: 0,
        points: 0,
        passes: 3,
        message: 'Guess the scrambled word.',
        messageColor: 'white',
        playAgain: false // indicates if time to play again
      }
    }
  },
  created: function () {
    // retrieves stored game data (if any) when game is loaded
    const game = localStorage.getItem('scramble')
    if (game) {
      this.game = JSON.parse(game)
    }
  },
  methods: {
    guessWord: function () {
      // if the guess is correct
      //    increase points
      //    remove guessed word from array
      //    if not last word
      //        prompt player to guess next word
      //    else
      //        display winning message
      //        allow to play again
      if (this.game.guess.toLowerCase() === this.game.word) {
        this.game.points++
        this.game.messageColor = 'rgb(0, 255, 0, 0.2)'
        this.game.words.shift()
        if (this.game.words.length > 0) {
          this.game.message = 'Correct! Here is the next word.'
        }
        else {
          this.game.playAgain = true
          this.game.message = 'You guessed all the words! Play again?'
        }
      }
      // else if the guess is incorrect
      //    increase strikes
      //    if strikes reach maximum
      //        display losing message
      //        allow to play again
      //    if not
      //        display message to guess again      
      else {
        this.game.strikes++
        this.game.messageColor = 'rgb(255, 0, 0, 0.2)'
        if (this.game.strikes === this.maxStrikes) {
          this.game.playAgain = true
          this.game.message = 'You lost. Play again?'
        }
        else {
          this.game.message = 'Incorrect. Please guess again.'
        }
      }
      // clear textbox after each guess
      this.game.guess = ''
    },
    pass: function () {
      // decrease passes remaining
      // go to next word
      // if no words left
      //    display message informing player
      //    allow to play again
      // else
      //    display pass message
      this.game.passes--
      this.game.messageColor = 'rgb(255, 232, 98, 0.8)'
      this.game.words.shift()
      if (this.game.words.length === 0) {
        this.game.playAgain = true
        this.game.message = 'You passed the last word. Play again?'
      }
      else {
        this.game.message = 'Pass! Here is the next word.'
      }
    },
    restartGame: function () {
      // sets game data to defaults
      this.game.words = words.slice(0)
      this.game.strikes= 0
      this.game.points = 0
      this.game.passes = 3
      this.game.message = 'Guess the scrambled word.',
      this.game.messageColor = 'white',
      this.game.playAgain = false
    }
  },
  computed: {
    // returns first word from words array as current word
    // does so whenever the words array changes
    // if no words left, returns empty string
    word: function () {
      if (this.game.words.length > 0) {
        this.game.word = this.game.words[0]
        return this.game.word
      }
      else {
        return ''
      }
    },
    // returns scrambled version of word
    // does so whenever the current word changes
    scrambled: function () {
      return shuffle(this.word).toUpperCase()
    }
  },
  watch: {
    // game data is being watched for changes to update local storage
    game: {
      deep: true,
      handler: function (game) {
        localStorage.setItem('scramble', JSON.stringify(game))
      }
    }
  }
})

// mounts Vue application
const vm = app.mount('#app')