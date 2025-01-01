import axios from "axios";

const API_BASE_URL = "/api";

export const apiService = {
	/**
	 * Handle API responses and throw a common error if necessary.
	 */
	async handleResponse<T>(response: any): Promise<T> {
		if (response.status >= 400) {
			throw {
				statusCode: response.status,
				message: response.data?.message || "An error occurred",
			};
		}
		return response.data;
	},

	/**
	 * Generic GET request
	 */
	async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		try {
			const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
				params,
			});
			return this.handleResponse<T>(response);
		} catch (error: any) {
			throw {
				statusCode: error.response?.status || 500,
				message: error.response?.data?.message || "Server error",
			};
		}
	},

	/**
	 * Generic POST request
	 */
	async post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
		try {
			const response = await axios.post(
				`${API_BASE_URL}${endpoint}`,
				data
			);
			return this.handleResponse<T>(response);
		} catch (error: any) {
			throw {
				statusCode: error.response?.status || 500,
				message: error.response?.data?.message || "Server error",
			};
		}
	},

	/**
	 * Generic PUT request
	 */
	async put<T>(endpoint: string, data: Record<string, any>): Promise<T> {
		try {
			const response = await axios.put(
				`${API_BASE_URL}${endpoint}`,
				data
			);
			return this.handleResponse<T>(response);
		} catch (error: any) {
			throw {
				statusCode: error.response?.status || 500,
				message: error.response?.data?.message || "Server error",
			};
		}
	},

	/**
	 * Generic DELETE request
	 */
	async delete<T>(endpoint: string): Promise<T> {
		try {
			const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
			return this.handleResponse<T>(response);
		} catch (error: any) {
			throw {
				statusCode: error.response?.status || 500,
				message: error.response?.data?.message || "Server error",
			};
		}
	},
};
