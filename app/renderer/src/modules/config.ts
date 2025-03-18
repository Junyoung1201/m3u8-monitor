export function getConfig() {

    let videoOutputPath = (document.querySelector("input#output-folder")! as HTMLInputElement).value;

    return {
        videoOutputPath     
    }
}