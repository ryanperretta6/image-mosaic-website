function imageCheck(fileType: string): boolean{
    let prefix: string = fileType.split("/")[0];

    if(prefix !== "image")
        return false
    return true;
}

export default imageCheck;