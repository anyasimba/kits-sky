type LoadFileType = 'data-url' | 'text'

export function loadFileFromDisk(type: LoadFileType) {
    return new Promise<string>(resolve => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.addEventListener(
            'change',
            e => {
                const target = e.target as HTMLInputElement
                const file = target.files[0]
                if (!file) {
                    return
                }
                const reader = new FileReader()
                reader.onload = function (e) {
                    resolve(e.target.result as string)
                }
                switch (type) {
                    case 'data-url': {
                        reader.readAsDataURL(file)
                        break
                    }
                    case 'text': {
                        reader.readAsText(file)
                        break
                    }
                }
            },
            false
        )
        input.click()
    })
}
