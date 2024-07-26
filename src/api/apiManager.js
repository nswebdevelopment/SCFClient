import axios from "axios";

function useApiManager() {
  console.log("ApiManager", localStorage);

  let isRefreshing = false;
  let failedQueue = [];

  // Create an axios instance with the Authorization header
  const api = axios.create({
    baseURL: "http://localhost:5064/",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });


  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };


  // Add a request interceptor
api.interceptors.request.use((request) => {
    console.log('Request', request.method, request.url, request.data??'', request.params??'');
    return request;
  });
  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
        console.log("call:", response.request.responseURL, response.config.data?? '', 'response:', response.data);
      return response;
    },
    async (error) => {
      console.log("errorApiManager", error.response);
      if (error.response.status === 401) {
        const originalRequest = error.config;
        if (!isRefreshing) {
          isRefreshing = true;
            console.log("refreshTokenApi");
          refreshTokenApi()
            .then((response) => {
              isRefreshing = false;
              // The access token is usually located in the response data
              const token = response.data.token;
              const refreshToken = response.data.refreshToken;
              // Save the token to localStorage
              setToken(token, refreshToken);

              processQueue(null, token);
            })
            .catch((refreshError) => {
              processQueue(refreshError, null);
              window.location.href = "/"; // Redirect to login page
            });
        }

        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      return error;
    }
  );

  function refreshTokenApi() {
    return api
      .post("auth/refresh", {
        refreshToken: localStorage.getItem("refresh_token"),
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {});
  }

  function setToken(token, refresh) {
    console.log("updatedToken: "+token);
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refresh);
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return { api, setToken };
}

export default useApiManager;
