// Helper functions that sends requests to the API with the correct configuration
// Credentials included to allow JWT tokens to be sent through cookies
const API_URL: string = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "http://localhost:8000";

export async function get(route: string, body?: object) {
  const response = await fetch(API_URL + route, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    return response.json();
  }
}
export async function post(route: string, body?: object) {
  const response = await fetch(API_URL + route, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    return response.json();
  }
}
export async function put(route: string, body?: object) {
  const response = await fetch(API_URL + route, {
    method: "PUT",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    return response.json();
  }
}
export async function patch(route: string, body?: object) {
  const response = await fetch(API_URL + route, {
    method: "PATCH",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    return response.json();
  }
}
export async function mdelete(route: string, body?: object) {
  const response = await fetch(API_URL + route, {
    method: "DELETE",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    return response.json();
  }
}
