export const getImageBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};
