const URL: string = "https://cvwo-web-forum-api.onrender.com"

export function get(route: string, body?: object) {
  return fetch(URL + route, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  }).then((response: Response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  });
}
export function post(route: string, body?: object) {
  return fetch(URL + route, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  }).then((response: Response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  });
}
export function put(route: string, body?: object) {
  return fetch(URL + route, {
    method: "PUT",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  }).then((response: Response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  });
}
export function patch(route: string, body?: object) {
  return fetch(URL + route, {
    method: "PATCH",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  }).then((response: Response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  });
}
export function mdelete(route: string, body?: object) {
  return fetch(URL + route, {
    method: "DELETE",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  }).then((response: Response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  });
}
