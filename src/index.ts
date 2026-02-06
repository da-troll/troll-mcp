#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { client } from "./client.js";

const server = new McpServer({
  name: "trollspace",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function err(error: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(error, null, 2) }],
    isError: true as const,
  };
}

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

server.tool(
  "list_snippets",
  "List all code snippets",
  { limit: z.number().optional().describe("Maximum number of snippets to return") },
  async ({ limit }) => {
    const { data, error } = await client.GET("/api/v1/snippets", {
      params: { query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_snippet",
  "Get a code snippet by ID",
  { id: z.string().describe("Snippet ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/snippets/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_snippet",
  "Create a new code snippet",
  {
    name: z.string().describe("Snippet name"),
    description: z.string().describe("Snippet description"),
    code: z.string().describe("The code content"),
    language: z.string().describe("Programming language"),
    tags: z.array(z.string()).optional().describe("Tags for categorization"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/snippets", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_snippet",
  "Update an existing code snippet",
  {
    id: z.string().describe("Snippet ID"),
    name: z.string().optional().describe("New name"),
    description: z.string().optional().describe("New description"),
    code: z.string().optional().describe("New code content"),
    language: z.string().optional().describe("New language"),
    tags: z.array(z.string()).optional().describe("New tags"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/snippets/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_snippet",
  "Delete a code snippet",
  { id: z.string().describe("Snippet ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/snippets/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Nuggets
// ---------------------------------------------------------------------------

server.tool(
  "list_nuggets",
  "List all knowledge nuggets",
  { limit: z.number().optional().describe("Maximum number of nuggets to return") },
  async ({ limit }) => {
    const { data, error } = await client.GET("/api/v1/nuggets", {
      params: { query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_nugget",
  "Get a knowledge nugget by ID",
  { id: z.string().describe("Nugget ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/nuggets/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_nugget",
  "Create a new knowledge nugget",
  {
    name: z.string().describe("Nugget name"),
    description: z.string().describe("Nugget description"),
    content: z.string().describe("Nugget content"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/nuggets", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_nugget",
  "Update an existing knowledge nugget",
  {
    id: z.string().describe("Nugget ID"),
    name: z.string().optional().describe("New name"),
    description: z.string().optional().describe("New description"),
    content: z.string().optional().describe("New content"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/nuggets/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_nugget",
  "Delete a knowledge nugget",
  { id: z.string().describe("Nugget ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/nuggets/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Todos
// ---------------------------------------------------------------------------

server.tool(
  "list_todos",
  "List all todo lists",
  { limit: z.number().optional().describe("Maximum number of todos to return") },
  async ({ limit }) => {
    const { data, error } = await client.GET("/api/v1/todos", {
      params: { query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_todo",
  "Get a todo list by ID",
  { id: z.string().describe("Todo ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/todos/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_todo",
  "Create a new todo list",
  {
    name: z.string().describe("Todo list name"),
    description: z.string().describe("Todo list description"),
    content: z.string().describe("Todo content (markdown checklist)"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/todos", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_todo",
  "Update an existing todo list",
  {
    id: z.string().describe("Todo ID"),
    name: z.string().optional().describe("New name"),
    description: z.string().optional().describe("New description"),
    content: z.string().optional().describe("New content"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/todos/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_todo",
  "Delete a todo list",
  { id: z.string().describe("Todo ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/todos/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Ideas
// ---------------------------------------------------------------------------

server.tool(
  "list_ideas",
  "List all ideas",
  { limit: z.number().optional().describe("Maximum number of ideas to return") },
  async ({ limit }) => {
    const { data, error } = await client.GET("/api/v1/ideas", {
      params: { query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_idea",
  "Get an idea by ID",
  { id: z.string().describe("Idea ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/ideas/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_idea",
  "Create a new idea",
  {
    name: z.string().describe("Idea name"),
    content: z.string().describe("Idea content"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/ideas", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_idea",
  "Update an existing idea",
  {
    id: z.string().describe("Idea ID"),
    name: z.string().optional().describe("New name"),
    content: z.string().optional().describe("New content"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/ideas/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_idea",
  "Delete an idea",
  { id: z.string().describe("Idea ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/ideas/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Tools (software tools/resources)
// ---------------------------------------------------------------------------

server.tool(
  "list_tools",
  "List all software tools and resources",
  { limit: z.number().optional().describe("Maximum number of tools to return") },
  async ({ limit }) => {
    const { data, error } = await client.GET("/api/v1/tools", {
      params: { query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_tool",
  "Get a software tool by ID",
  { id: z.string().describe("Tool ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/tools/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_tool",
  "Create a new software tool entry",
  {
    name: z.string().describe("Tool name"),
    url: z.string().optional().describe("Tool URL"),
    category: z.string().optional().describe("Tool category"),
    description: z.string().optional().describe("Tool description"),
    rating: z.number().optional().describe("Rating (1-5)"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/tools", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_tool",
  "Update an existing software tool entry",
  {
    id: z.string().describe("Tool ID"),
    name: z.string().optional().describe("New name"),
    url: z.string().optional().describe("New URL"),
    category: z.string().optional().describe("New category"),
    description: z.string().optional().describe("New description"),
    rating: z.number().optional().describe("New rating"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/tools/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_tool",
  "Delete a software tool entry",
  { id: z.string().describe("Tool ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/tools/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Repos
// ---------------------------------------------------------------------------

server.tool(
  "list_repos",
  "List all git repositories",
  { limit: z.number().optional().describe("Maximum number of repos to return") },
  async ({ limit }) => {
    const { data, error } = await client.GET("/api/v1/repos", {
      params: { query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_repo",
  "Get a git repository by ID",
  { id: z.string().describe("Repo ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/repos/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_repo",
  "Create a new git repository entry",
  {
    title: z.string().describe("Repository title"),
    summary: z.string().optional().describe("Brief summary"),
    description_md: z.string().optional().describe("Detailed description in markdown"),
    repo_url: z.string().optional().describe("Repository URL"),
    source_type: z.enum(["github", "manual"]).describe("Source type"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/repos", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_repo",
  "Update an existing git repository entry",
  {
    id: z.string().describe("Repo ID"),
    title: z.string().optional().describe("New title"),
    summary: z.string().optional().describe("New summary"),
    description_md: z.string().optional().describe("New description in markdown"),
    repo_url: z.string().optional().describe("New URL"),
    source_type: z.string().optional().describe("New source type"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/repos/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_repo",
  "Delete a git repository entry",
  { id: z.string().describe("Repo ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/repos/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Travel
// ---------------------------------------------------------------------------

server.tool(
  "list_travel",
  "List travel locations",
  {
    limit: z.number().optional().describe("Maximum number of locations to return"),
    status: z.enum(["visited", "want_to_visit", "lived"]).optional().describe("Filter by status"),
    location_type: z.enum(["country", "city"]).optional().describe("Filter by location type"),
  },
  async (params) => {
    const { data, error } = await client.GET("/api/v1/travel", {
      params: { query: params },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_travel",
  "Get a travel location by ID",
  { id: z.string().describe("Travel location ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/travel/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_travel",
  "Add a new travel location. Use list_countries or list_cities to find the location_id first.",
  {
    location_id: z.string().describe("UUID from countries or cities endpoint"),
    location_type: z.enum(["country", "city"]).describe("Whether this is a country or city"),
    status: z.enum(["visited", "want_to_visit", "lived"]).describe("Travel status"),
    date_from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    date_to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    notes: z.string().optional().describe("Notes about this location"),
    is_favorite: z.boolean().describe("Whether this is a favorite location"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/travel", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_travel",
  "Update an existing travel location",
  {
    id: z.string().describe("Travel location ID"),
    status: z.enum(["visited", "want_to_visit", "lived"]).optional().describe("New status"),
    date_from: z.string().optional().describe("New start date (YYYY-MM-DD)"),
    date_to: z.string().optional().describe("New end date (YYYY-MM-DD)"),
    notes: z.string().optional().describe("New notes"),
    is_favorite: z.boolean().optional().describe("New favorite status"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/travel/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_travel",
  "Remove a travel location",
  { id: z.string().describe("Travel location ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/travel/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Countries (read-only reference data)
// ---------------------------------------------------------------------------

server.tool(
  "list_countries",
  "List countries (reference data for travel)",
  {
    limit: z.number().optional().describe("Maximum number of countries to return"),
    search: z.string().optional().describe("Search by country name"),
    continent: z.string().optional().describe("Filter by continent"),
  },
  async (params) => {
    const { data, error } = await client.GET("/api/v1/countries", {
      params: { query: params },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_country",
  "Get a country by ID",
  { id: z.string().describe("Country ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/countries/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Cities (read-only reference data)
// ---------------------------------------------------------------------------

server.tool(
  "list_cities",
  "List cities (reference data for travel)",
  {
    limit: z.number().optional().describe("Maximum number of cities to return"),
    search: z.string().optional().describe("Search by city name"),
    country_id: z.string().optional().describe("Filter by country ID"),
  },
  async (params) => {
    const { data, error } = await client.GET("/api/v1/cities", {
      params: { query: params },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_city",
  "Get a city by ID",
  { id: z.string().describe("City ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/cities/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

server.tool(
  "list_subscriptions",
  "List all subscriptions",
  {
    limit: z.number().optional().describe("Maximum number of subscriptions to return"),
    status: z.enum(["active", "cancelled"]).optional().describe("Filter by status"),
    category: z.string().optional().describe("Filter by category"),
    usage_type: z.enum(["personal", "work"]).optional().describe("Filter by usage type"),
    billing_cycle: z.enum(["monthly", "yearly"]).optional().describe("Filter by billing cycle"),
  },
  async (params) => {
    const { data, error } = await client.GET("/api/v1/subscriptions", {
      params: { query: params },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_subscription",
  "Get a subscription by ID",
  { id: z.string().describe("Subscription ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/subscriptions/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_subscription",
  "Create a new subscription",
  {
    name: z.string().describe("Subscription name (e.g. Netflix)"),
    amount: z.number().describe("Amount per billing cycle"),
    currency: z.string().describe("Currency code (e.g. NOK, USD)"),
    billing_cycle: z.enum(["monthly", "yearly"]).describe("Billing cycle"),
    category: z.string().optional().describe("Category (e.g. Entertainment)"),
    start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    next_billing_date: z.string().optional().describe("Next billing date (YYYY-MM-DD)"),
    payment_method: z.string().optional().describe("Payment method"),
    usage_type: z.enum(["personal", "work"]).describe("Usage type"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/subscriptions", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_subscription",
  "Update an existing subscription",
  {
    id: z.string().describe("Subscription ID"),
    name: z.string().optional().describe("New name"),
    category: z.string().optional().describe("New category"),
    amount: z.number().optional().describe("New amount"),
    currency: z.string().optional().describe("New currency"),
    billing_cycle: z.enum(["monthly", "yearly"]).optional().describe("New billing cycle"),
    start_date: z.string().optional().describe("New start date (YYYY-MM-DD)"),
    next_billing_date: z.string().optional().describe("New next billing date (YYYY-MM-DD)"),
    payment_method: z.string().optional().describe("New payment method"),
    usage_type: z.enum(["personal", "work"]).optional().describe("New usage type"),
    status: z.enum(["active", "cancelled"]).optional().describe("New status"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/subscriptions/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_subscription",
  "Delete a subscription (payment history is preserved)",
  { id: z.string().describe("Subscription ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/subscriptions/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "mark_subscription_paid",
  "Record a payment for the current billing period and advance the next billing date",
  { id: z.string().describe("Subscription ID") },
  async ({ id }) => {
    const { data, error } = await client.POST("/api/v1/subscriptions/{id}/mark-paid", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "backfill_subscription",
  "Generate historical payment records for past billing periods",
  {
    id: z.string().describe("Subscription ID"),
    periods: z.array(z.string()).describe("Billing periods (monthly: YYYY-MM, yearly: YYYY)"),
    amount: z.number().describe("Payment amount per period"),
    currency: z.string().describe("Currency code"),
    usage_type: z.enum(["personal", "work"]).optional().describe("Usage type"),
    overwrite_existing: z.boolean().describe("If true, overwrites existing payments for these periods"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.POST("/api/v1/subscriptions/{id}/backfill", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "list_subscription_payments",
  "List payment records for a specific subscription",
  {
    id: z.string().describe("Subscription ID"),
    limit: z.number().optional().describe("Maximum number of payments to return"),
  },
  async ({ id, limit }) => {
    const { data, error } = await client.GET("/api/v1/subscriptions/{id}/payments", {
      params: { path: { id }, query: { limit } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Subscription Payments (cross-subscription)
// ---------------------------------------------------------------------------

server.tool(
  "list_all_payments",
  "List payment records across all subscriptions",
  {
    limit: z.number().optional().describe("Maximum number of payments to return"),
    subscription_id: z.string().optional().describe("Filter by subscription ID"),
    status: z.enum(["paid", "pending", "skipped"]).optional().describe("Filter by payment status"),
    usage_type: z.enum(["personal", "work"]).optional().describe("Filter by usage type"),
    source: z.enum(["manual", "backfilled", "mark_paid", "monthly_generation"]).optional().describe("Filter by payment source"),
    date_from: z.string().optional().describe("Filter from date (YYYY-MM-DD, inclusive)"),
    date_to: z.string().optional().describe("Filter to date (YYYY-MM-DD, inclusive)"),
  },
  async (params) => {
    const { data, error } = await client.GET("/api/v1/subscription-payments", {
      params: { query: params },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "get_payment",
  "Get a subscription payment by ID",
  { id: z.string().describe("Payment ID") },
  async ({ id }) => {
    const { data, error } = await client.GET("/api/v1/subscription-payments/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "create_payment",
  "Manually create a payment record for a subscription",
  {
    subscription_id: z.string().describe("Subscription ID"),
    payment_date: z.string().describe("Payment date (YYYY-MM-DD)"),
    amount: z.number().describe("Payment amount"),
    currency: z.string().describe("Currency code"),
    status: z.enum(["paid", "pending", "skipped"]).describe("Payment status"),
    usage_type: z.enum(["personal", "work"]).optional().describe("Usage type"),
    notes: z.string().optional().describe("Payment notes"),
  },
  async (params) => {
    const { data, error } = await client.POST("/api/v1/subscription-payments", {
      body: params,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "update_payment",
  "Update an existing payment record",
  {
    id: z.string().describe("Payment ID"),
    amount: z.number().optional().describe("New amount"),
    currency: z.string().optional().describe("New currency"),
    status: z.enum(["paid", "pending", "skipped"]).optional().describe("New status"),
    usage_type: z.enum(["personal", "work"]).optional().describe("New usage type"),
    notes: z.string().optional().describe("New notes"),
  },
  async ({ id, ...body }) => {
    const { data, error } = await client.PUT("/api/v1/subscription-payments/{id}", {
      params: { path: { id } },
      body,
    });
    return error ? err(error) : ok(data);
  },
);

server.tool(
  "delete_payment",
  "Permanently delete a payment record",
  { id: z.string().describe("Payment ID") },
  async ({ id }) => {
    const { data, error } = await client.DELETE("/api/v1/subscription-payments/{id}", {
      params: { path: { id } },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Agent (natural language API)
// ---------------------------------------------------------------------------

server.tool(
  "agent_query",
  "Send a natural language request to the Trollspace agent for complex operations",
  {
    message: z.string().describe("Natural language request (e.g. 'Add France as a country I want to visit')"),
  },
  async ({ message }) => {
    const { data, error } = await client.POST("/agent", {
      body: { message },
    });
    return error ? err(error) : ok(data);
  },
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
