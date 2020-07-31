<template>
  <v-container style="max-width: 800px">
    <div id="bingo" class="ma-4">
      <div v-for="i in Array.from(Array(size).keys())" :key="i" class="bingo-line" :style="{height: `${100 / size}%`}">
        <div v-for="j in Array.from(Array(size).keys())" :key="j" class="bingo-block pa-1" :style="{width: `${100 / size}%`}">
          <div class="card-box" :class="{flipped: flips[i * size + j]}">
            <v-card
              width="100%"
              height="100%"
              class="bingo-card card-front"
              :style="{background: flags[i * size + j] ? '#DB4D6D' : '#86C166'}"
              @click="flip(i * size + j)"
            >
              <div class="bingo-text" style="font-size: 10vmin">
                {{ i * size + j }}
              </div>
            </v-card>
            <v-card
              width="100%"
              height="100%"
              class="bingo-card card-back"
              :style="{background: flags[i * size + j] ? '#E87A90' : '#FCFAF2'}"
              @click="flip(i * size + j)"
            >
              <div class="bingo-text mx-1" style="font-size: 2vmin">
                {{ tasks[i * size + j] }}
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </div>
    <v-btn
      dark
      fab
      large
      color="pink"
      style="bottom: 10vh; right: 10vw; position: fixed"
      @click="add"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Bingo 设置</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-input label="大小">
              <v-btn-toggle
                v-model="size_"
                class="ml-1"
                color="primary"
                group
              >
                <v-btn :value="4">
                  4 ✖ 4
                </v-btn>
                <v-btn :value="5">
                  5 ✖ 5
                </v-btn>
                <v-btn :value="6">
                  6 ✖ 6
                </v-btn>
              </v-btn-toggle>
            </v-input>
            <v-input label="配置">
              <v-file-input v-model="file" class="ml-2" label="配置文件" prepend-icon="" />
            </v-input>
            <v-input label="显示内容">
              <v-btn-toggle
                v-model="show"
                class="ml-1"
                color="primary"
                group
              >
                <v-btn :value="true">
                  显示
                </v-btn>
                <v-btn :value="false">
                  不显示
                </v-btn>
              </v-btn-toggle>
            </v-input>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" dark text @click="start">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="bingoDialog" persistent max-width="300px">
      <v-card>
        <v-card-title style="text-align: center; display: block; font-size: 3rem; line-height: 3.2rem; color: red">
          BINGO!
        </v-card-title>
        <v-card-text style="font-size: 1rem; text-align: center;">
          {{ `最后一个任务：${tasks[result[next - 1]]}` }}
          <br>
          {{ `奖励：${award}` }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" dark text @click="bingoDialog = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Bingo',
  data () {
    return {
      size: 5,
      total: 25,
      file: undefined,
      tasks: [],
      award: '没有奖励哦',
      flags: [],
      flips: [],
      dialog: true,
      size_: 5,
      show: false,
      result: [],
      next: 0,
      bingoDialog: false
    }
  },
  mounted () {
    document.getElementById('bingo').style.height = `${document.getElementById('bingo').clientWidth}px`
  },
  methods: {
    shuffle (a) {
      let j, x, i
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
      }
      return a
    },
    start () {
      this.size = this.size_
      this.total = this.size ** 2
      this.flags = Array(this.total).fill(false)
      this.flips = Array(this.total).fill(false)
      this.result = this.shuffle(Array.from(Array(this.total).keys()))
      if (this.file) {
        const reader = new FileReader()
        reader.onload = (evt) => {
          const res = JSON.parse(evt.target.result)
          this.tasks = res.tasks
          while (this.tasks.length < this.total) {
            this.tasks = this.tasks.concat([...res.tasks])
          }
          this.tasks = this.shuffle(this.tasks).splice(0, this.total)

          const index = Math.floor(Math.random() * (res.awards.length))
          this.award = res.awards[index]

          this.dialog = false
        }
        reader.readAsText(this.file)
      } else {
        this.dialog = false
        this.tasks = Array(this.total).fill('啥也没有哦')
      }
    },
    flip (index) {
      if (this.show || this.flags[index]) {
        this.$set(this.flips, index, !this.flips[index])
      }
    },
    add () {
      const index = this.result[this.next]
      this.$set(this.flags, index, true)
      let flag = true
      for (let i = 0; i < this.size; i++) {
        if (!this.flags[i + Math.floor(index / this.size) * this.size]) {
          flag = false
          break
        }
      }
      if (!flag) {
        flag = true
        for (let i = 0; i < this.size; i++) {
          if (!this.flags[i * this.size + index % this.size]) {
            flag = false
            break
          }
        }
        if (flag) {
          this.bingoDialog = true
        } else {
          this.flip(index)
        }
      } else {
        this.bingoDialog = true
      }
      this.next += 1
    }
  }
}
</script>

<style scoped>
.bingo-line {

}
.bingo-block {
  float: left;
  height: 100%;
  perspective: 1000;
}
.bingo-card {
  position: absolute;
  backface-visibility: hidden;
}
.card-box {
  width: 100%;
  height: 100%;
  position: sticky;
  transform-style: preserve-3d;
  transition: transform 1s;
}
.card-front {
}
.card-back {
  transform: rotateY(180deg);
}
.bingo-text {
  color: white;
  transform: translateY(-50%);
  top: 50%;
  position: relative;
  text-align: center;
}
.flipped {
  transform: rotateY(180deg);
}
</style>
