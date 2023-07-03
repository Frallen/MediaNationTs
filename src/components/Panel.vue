<template>
  <div class="container">
    <div class="panel">
      <div class="panel-header">
        <div class="panel-header-text box">
          Начните вводить текст, чтобы измерить скорость печати.
          Когда вы начнете вводить текст, таймер автоматически запустится и остановится, когда введенный текст будет
          соответствовать приведенному ниже.
        </div>
        <div class="panel-header-lang">
          <label :for="item.id" class="button"
                 :class="{'button-primary ':checkedLang===item.value,'button-secondary':checkedLang!==item.value}"
                 v-for="item in Languages" :key="item.id"
                 @click="checkedLang=item.value;fetchText(item.value);resetInput()"
          >
            {{ item.Name }}
            <input type="radio" name="lang" :id="item.id" v-model="checkedLang" :value="item.value"
                   :checked="checkedLang"
                   hidden>
          </label>

        </div>
      </div>
      <div class="panel-body">
        <transition name="fade">
          <div class="panel-body-text box">
            {{ Text?.quoteText }}
          </div>
        </transition>
        <div class="panel-body-action">
          <div class="timer" :class="{'timer-active':!completed}">{{ currentTime }}</div>
          <div class="button button-primary" @click="fetchText(checkedLang);resetInput()">Взять новый текст</div>
        </div>
        <textarea class="input" id="text" @paste.prevent v-model="userInput" @input="checkInput" ref="textInput"
                  autofocus></textarea>
        <transition name="fade">
          <div v-show="completed" class="panel-body-result box">
            <p>Время: {{ time }} секунд</p>
            <p>Скорость: {{ speed }} символов в минуту</p>
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

const {fetchText} = useMain()
const {Text, Languages} = storeToRefs(useMain())

const checkedLang = ref<string>("ru")

await fetchText("ru")

const userInput = ref<string>('');
const startTime = ref<number>(0);
const endTime = ref<number>(0);
const timer = ref<number>()
const currentTime = ref<number>(0)
const completed = ref<boolean>(false);

const time: Ref<number> = computed(() => {
  return ((endTime.value - startTime.value) / 1000).toFixed(2);
});

const speed = computed(() => {
  const charactersTyped = userInput.value.length;
  const minutes = time.value / 60;
  return Math.round(charactersTyped / minutes);
});

const startTimer = () => {
  timer.value = setInterval(() => {
    currentTime.value++;
  }, 1000);
};
const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = 0;
  }
};
const checkInput = () => {
  if (!startTime.value) {
    startTime.value = Date.now();
    startTimer()
  }
};


const resetInput = () => {
  userInput.value = '';
  startTime.value = 0;
  endTime.value = 0;
  completed.value = false;
  stopTimer()
};


onMounted(resetInput);

watch(Text, () => {
  resetInput()
});
watch(userInput, () => {
  if (userInput.value === Text.value?.quoteText) {
    endTime.value = Date.now();
    completed.value = true;
    stopTimer()
  }
})


</script>

<style scoped lang="less">
.panel {
  display: flex;
  flex-direction: column;
  margin: 2em 0;

  &-header {
    display: flex;
    justify-content: space-between;
    @media @lg {
      flex-direction: column;
    }

    &-text {
      width: 60%;
      @media @lg {
        width: 100%;
      }
    }

    &-lang {
      display: flex;
      align-items: center;
      width: 30%;
      @media @lg {
        width: 100%;
        margin: 1em 0 0;
        justify-content: space-between;
      }

      .button {
        width: 48%;
      }

      .button:last-child {
        margin: 0 0 0 10px;
        @media @lg {
          margin: 0;
        }
      }
    }
  }

  &-body {
    margin: 1em 0;

    &-result {
      margin: 1em 0 0;
    }

    &-text {
      margin: 1em 0;
    }

    textarea {
      resize: none;
      width: 100%;
      height: 300px;
    }

    &-action {
      margin: 2em 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .timer {
        text-align: center;
        font-weight: 700;
        font-size: 2em;
        color: @black;

        animation: timer-animation 1s infinite alternate;
      }

      .timer-active {
        animation: timer-animation 1s infinite alternate;
      }
    }

  }

}

@keyframes timer-animation {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

</style>