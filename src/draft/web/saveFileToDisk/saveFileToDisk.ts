// production
export function saveFile (data, filename: string, type: string) {
    var file = new Blob([data], {type})
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename)
    } else {
        const a = document.createElement("a")
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function() {
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }, 0)
    }
}
