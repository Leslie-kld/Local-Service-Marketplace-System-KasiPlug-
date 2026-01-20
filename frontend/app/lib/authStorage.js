// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ACCESS_KEY = "access_token";
// const REFRESH_KEY = "refresh_token"

// /**
//  * Store both tokens atomically
//  * @param {{access: string, refresh: string}} tokens
//  */

// export async function storeTokens(tokens) {
//     try {
//         const kv = [
//             [ACCESS_KEY, tokens.access || ""],
//             [REFRESH_KEY, tokens.refresh || ""],
//         ];
//         await AsyncStorage.multiSet(kv);
//         return true;
//     } catch (err) {
//         console.error("storeTokens error", err);
//         return false;
//     }
// }

// export async function getAccessToken() {
//   try {
//     return await AsyncStorage.getItem(ACCESS_KEY);
//   } catch (err) {
//     console.error("getAccessToken error", err);
//     return null;
//   }
// }

// export async function getRefreshToken() {
//   try {
//     return await AsyncStorage.getItem(REFRESH_KEY);
//   } catch (err) {
//     console.error("getRefreshToken error", err);
//     return null;
//   }
// }

// export async function clearTokens() {
//   try {
//     await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
//     return true;
//   } catch (err) {
//     console.error("clearTokens error", err);
//     return false;
//   }
// }

// export async function refreshAccessToken() {
//   const refresh = await getRefreshToken();
//   if (!refresh) return null;

//   try {
//     const res = await api.post("auth/refresh/", { refresh });
//     const newAccess = res.data.access;
//     await AsyncStorage.setItem(ACCESS_KEY, newAccess);
//     api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
//     return newAccess;
//   } catch (err) {
//     console.error("Refresh failed", err?.response?.data || err.message);
//     return null;
//   }
// }

// export default storeTokens; 

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const BASE = "http://192.168.0.86:8000/api/"; // adjust your backend IP

export async function storeTokens(tokens) {
  try {
    const kv = [
      [ACCESS_KEY, tokens.access || ""],
      [REFRESH_KEY, tokens.refresh || ""],
    ];
    await AsyncStorage.multiSet(kv);
    return true;
  } catch (err) {
    console.error("storeTokens error", err);
    return false;
  }
}

export async function getAccessToken() {
  try {
    return await AsyncStorage.getItem(ACCESS_KEY);
  } catch (err) {
    console.error("getAccessToken error", err);
    return null;
  }
}

export async function getRefreshToken() {
  try {
    return await AsyncStorage.getItem(REFRESH_KEY);
  } catch (err) {
    console.error("getRefreshToken error", err);
    return null;
  }
}

export async function clearTokens() {
  try {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
    return true;
  } catch (err) {
    console.error("clearTokens error", err);
    return false;
  }
}

/**
 * Request a new access token using refresh token.
 * Does NOT import api to avoid circular dependency.
 */
export async function refreshAccessToken() {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await axios.post(`${BASE}auth/refresh/`, { refresh });
    const newAccess = res.data.access;
    await AsyncStorage.setItem(ACCESS_KEY, newAccess);
    return newAccess;
  } catch (err) {
    console.error("Refresh failed", err?.response?.data || err.message);
    return null;
  }
}

export default { storeTokens, getAccessToken, getRefreshToken, clearTokens, refreshAccessToken };
