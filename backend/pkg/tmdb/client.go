package tmdb

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sync"
	"time"
)

const (
	baseURL      = "https://api.themoviedb.org/3"
	cacheDuration = 5 * time.Minute
)

type Client struct {
	httpClient *http.Client
	apiKey     string
	cache      *Cache
}

type Cache struct {
	sync.RWMutex
	items map[string]*CacheItem
}

type CacheItem struct {
	Data      interface{}
	Timestamp time.Time
}

func NewClient(apiKey string) *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		apiKey: apiKey,
		cache: &Cache{
			items: make(map[string]*CacheItem),
		},
	}
}

func (c *Client) get(endpoint string, params url.Values, v interface{}) error {
	cacheKey := endpoint + params.Encode()

	// Check cache
	if data := c.cache.get(cacheKey); data != nil {
		if cached, ok := data.(map[string]interface{}); ok {
			b, err := json.Marshal(cached)
			if err == nil {
				return json.Unmarshal(b, v)
			}
		}
	}

	// Build URL
	u, err := url.Parse(baseURL + endpoint)
	if err != nil {
		return err
	}

	// Add query parameters
	q := u.Query()
	for k, vs := range params {
		for _, v := range vs {
			q.Add(k, v)
		}
	}
	u.RawQuery = q.Encode()

	// Create request
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return err
	}

	// Add headers
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))

	// Make request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Decode response
	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return err
	}

	// Cache response
	c.cache.set(cacheKey, data)

	// Decode into target struct
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}

	return json.Unmarshal(b, v)
}

func (c *Cache) get(key string) interface{} {
	c.RLock()
	defer c.RUnlock()

	if item, exists := c.items[key]; exists {
		if time.Since(item.Timestamp) < cacheDuration {
			return item.Data
		}
		delete(c.items, key)
	}
	return nil
}

func (c *Cache) set(key string, data interface{}) {
	c.Lock()
	defer c.Unlock()

	c.items[key] = &CacheItem{
		Data:      data,
		Timestamp: time.Now(),
	}
} 