export const parseIdParam = (param: string | string[] | undefined): number => {
    const value = Array.isArray(param) ? param[0] : param;
    const id = parseInt(value ?? "", 10);
    if (isNaN(id)) {
        throw new Error("Invalid id parameter");
    }
    return id;
}