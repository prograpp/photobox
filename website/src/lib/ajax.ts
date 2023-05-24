import axios, { AxiosRequestHeaders } from "axios";
import React from "react";

type StatusCode = number | number[] | "*";

type Dict = {
  [key: string]: any;
};

type Payload = Dict | null;

type CallbackFunction = (data: any) => void;

type CallbackMap = Map<StatusCode, CallbackFunction>;

type AjaxRequest = {
  on: (status: StatusCode, cb: CallbackFunction) => AjaxRequest;
};

type AjaxRequestWithFormLink = AjaxRequest & {
  linkForm: (lock: [boolean, React.Dispatch<React.SetStateAction<boolean>>]) => AjaxRequest;
};

type AjaxInstance = {
  on: (status: StatusCode, cb: CallbackFunction) => void;
  setBaseUrl: (baseURL: string | undefined) => void;
  get: (endpoint: string, headers?: AxiosRequestHeaders) => AjaxRequest;
  post: <T extends Payload>(endpoint: string, data: T, headers?: AxiosRequestHeaders) => AjaxRequestWithFormLink;
  put: <T extends Payload>(endpoint: string, data: T, headers?: AxiosRequestHeaders) => AjaxRequestWithFormLink;
  delete: (endpoint: string, headers?: AxiosRequestHeaders) => AjaxRequestWithFormLink;
};

export const AjaxInstance = (baseURL?: string): AjaxInstance => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: baseURL,
  });

  const globalListeners: CallbackMap = new Map();

  const callMatchingListener = (localListeners: CallbackMap, status: number, data: any): void => {
    let listener = localListeners.get(status);
    if (listener !== undefined) {
      listener(data);
      return;
    }

    listener = globalListeners.get(status);
    if (listener !== undefined) {
      listener(data);
      return;
    }

    listener = localListeners.get("*");
    if (listener !== undefined) {
      listener(data);
      return;
    }

    listener = globalListeners.get("*");
    if (listener !== undefined) {
      listener(data);
      return;
    }

    throw new Error("There is no callback defined for status code " + status);
  };

  const setListenerHelper = (listeners: CallbackMap, status: StatusCode, cb: CallbackFunction): void => {
    if (Array.isArray(status)) {
      status.forEach((s) => {
        listeners.set(s, cb);
      });
    } else {
      listeners.set(status, cb);
    }
  };

  const setListener = (status: StatusCode, cb: CallbackFunction): void => {
    setListenerHelper(globalListeners, status, cb);
  };

  const setBaseUrl = (baseURL: string | undefined): void => {
    instance.defaults.baseURL = baseURL;
  };

  const get = (endpoint: string, headers?: AxiosRequestHeaders): AjaxRequest => {
    let localListeners: CallbackMap = new Map();

    let setListener = (status: StatusCode, cb: CallbackFunction): AjaxRequest => {
      setListenerHelper(localListeners, status, cb);
      return {
        on: setListener,
      };
    };

    instance
      .get(endpoint, { headers })
      .then((res) => {
        callMatchingListener(localListeners, res.status, res.data);
      })
      .catch((err) => {
        callMatchingListener(localListeners, err.response.status, err.response.data);
      });

    return {
      on: setListener,
    };
  };

  const post = <T extends Payload>(endpoint: string, data: T, headers?: AxiosRequestHeaders): AjaxRequestWithFormLink => {
    let localListeners: CallbackMap = new Map();
    let unlockForm: () => void = () => {};

    let setListener = (status: StatusCode, cb: CallbackFunction): AjaxRequest => {
      setListenerHelper(localListeners, status, cb);
      return {
        on: setListener,
      };
    };

    let linkForm = (lock: [boolean, React.Dispatch<React.SetStateAction<boolean>>]): AjaxRequest => {
      lock[1](() => true);
      unlockForm = () => {
        lock[1](() => false);
      };

      return {
        on: setListener,
      };
    };

    instance
      .post(endpoint, data, { headers })
      .then((res) => {
        callMatchingListener(localListeners, res.status, res.data);
        unlockForm();
      })
      .catch((err) => {
        callMatchingListener(localListeners, err.response.status, err.response.data);
        unlockForm();
      });

    return {
      on: setListener,
      linkForm: linkForm,
    };
  };

  const put = <T extends Payload>(endpoint: string, data: T, headers?: AxiosRequestHeaders): AjaxRequestWithFormLink => {
    let localListeners: CallbackMap = new Map();
    let unlockForm: () => void = () => {};

    let setListener = (status: StatusCode, cb: CallbackFunction): AjaxRequest => {
      setListenerHelper(localListeners, status, cb);
      return {
        on: setListener,
      };
    };

    let linkForm = (lock: [boolean, React.Dispatch<React.SetStateAction<boolean>>]): AjaxRequest => {
      lock[1](() => true);
      unlockForm = () => {
        lock[1](() => false);
      };

      return {
        on: setListener,
      };
    };

    instance
      .put(endpoint, data, { headers })
      .then((res) => {
        callMatchingListener(localListeners, res.status, res.data);
        unlockForm();
      })
      .catch((err) => {
        callMatchingListener(localListeners, err.response.status, err.response.data);
        unlockForm();
      });

    return {
      on: setListener,
      linkForm: linkForm,
    };
  };

  const del = (endpoint: string, headers?: AxiosRequestHeaders): AjaxRequestWithFormLink => {
    let localListeners: CallbackMap = new Map();
    let unlockForm: () => void = () => {};

    let setListener = (status: StatusCode, cb: CallbackFunction): AjaxRequest => {
      setListenerHelper(localListeners, status, cb);
      return {
        on: setListener,
      };
    };

    let linkForm = (lock: [boolean, React.Dispatch<React.SetStateAction<boolean>>]): AjaxRequest => {
      lock[1](() => true);
      unlockForm = () => {
        lock[1](() => false);
      };

      return {
        on: setListener,
      };
    };

    instance
      .delete(endpoint, { headers })
      .then((res) => {
        callMatchingListener(localListeners, res.status, res.data);
      })
      .catch((err) => {
        callMatchingListener(localListeners, err.response.status, err.response.data);
      });

    return {
      on: setListener,
      linkForm: linkForm,
    };
  };

  return {
    on: setListener,
    setBaseUrl: setBaseUrl,
    get: get,
    post: post,
    put: put,
    delete: del,
  };
};

export const ajax = ((): AjaxInstance => {
  return AjaxInstance();
})();
