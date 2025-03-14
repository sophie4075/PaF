package com.example.Rentify.configuration;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * This CorsFilter is a custom implementation to handle Cross-Origin Resource Sharing
 * for allowing cross-origin requests to the server.
 */

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)

public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        // Cast the generic ServletRequest and ServletResponse to their HTTP-specific implementations.
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        Map<String, String[]> parameterMap = new HashMap<>();
        // Get the "Origin" header from the HTTP request to identify the origin of the request.
        String originHeader = httpRequest.getHeader("Origin");

        // Allow the specific origin that sent the request. This dynamic assignment allows any
        // origin to access the resource
        //TODO: If time is left, fixed set of allowed origins
        httpResponse.setHeader("Access-Control-Allow-Origin", originHeader);

        // Allow specific HTTP methods for cross-origin requests
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

        // Specify how long the results of a preflight request can be cached by the browser.
        httpResponse.setHeader("Access-Control-Max-Age", "3600");

        //Allow all headers in the incoming request. The wildcard, allows any header included in cross-origin requests.
        //TODO: If time is left, restrict to specific headers for better security.
        httpResponse.setHeader("Access-Control-Allow-Headers", "*");

        // If the HTTP method is "OPTIONS" (preflight request), respond with HTTP 200 (OK) and do not
        // proceed further down the filter chain.
        if("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
        } else {
            // For non-preflight requests, pass the request and response to the next filter in the chain.
            chain.doFilter(request, response);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {}

}
