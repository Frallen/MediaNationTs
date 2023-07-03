import {textType} from "../types/global.types";

interface stateType {
    ModalState: boolean
    isError: boolean
    Text: textType | null
    Languages: Array<{
        Name: string
        value: string
        id: number
    }
    >
}

export const useMain = defineStore('main', {
    state: (): stateType => ({
        isError: false,
        ModalState: false,
        Text: null,
        Languages: [{
            Name: "Русский",
            value: "ru",
            id: 0,
        },
            {
                Name: "Английский",
                value: "en",
                id: 1
            }]
    }),
    getters: {},
    actions: {


        async fetchText(lang: string) {
            const {
                isFetching,
                error,
                data
            } = await useFetch(`${import.meta.env.DEV ? 'api' : 'http://api.forismatic.com/api/1.0/'}?method=getQuote&format=json&lang=${lang}`, {
                method: 'POST'
            })
            if (error.value) {
                console.error(error.value)
                this.isError = true
            } else {
                this.Text = JSON.parse(data.value as string) as textType
            }
        },
    }

})