export function bake_cookie(name: string, value: string): void {
    const cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
}

export function read_cookie(name: string): any | null {
    const result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (result) return JSON.parse(result[1])
    return null
}

export function delete_cookie(name: string): void {
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}