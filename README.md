# Hamlib API

The Hamlib API provides a RESTful interface for controlling amateur radio equipment and antenna rotators. This documentation covers all available endpoints, authentication methods, and includes an interactive playground for testing.

---

## Overview

[Hamlib](https://hamlib.github.io/) (Ham Radio Control Library) provides a standardized interface for controlling amateur radio transceivers and antenna rotators. This API wraps Hamlib's `rigctld` and `rotctld` daemons in a RESTful HTTP layer, allowing you to control your station programmatically over the network.

| Property        | Value                          |
| --------------- | ------------------------------ |
| Protocol        | HTTP / HTTPS                   |
| Format          | JSON                           |
| Default Port    | `4532`                         |
| Authentication  | API Key (header)               |
| Version         | `v4.5.0`                       |

---

## Base URL

All API requests are made relative to the base URL of your Hamlib server:

```
http://localhost:4532
```

Replace `localhost:4532` with the host and port where your Hamlib API server is running.

---

## Authentication

The Hamlib API uses **API key authentication**. Include your API key in the `X-API-Key` header with every request.

```bash
curl -X GET "http://localhost:4532/api/radio/frequency" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json"
```

> **Note:** Keep your API key secret. Do not commit it to version control or expose it in client-side code. For networked deployments, always use HTTPS to protect your credentials in transit.

---

## Response Format

All responses are returned as JSON. Successful responses include a `status` of `"ok"` and a `data` object:

```json
{
  "status": "ok",
  "data": {
    "frequency": 14250000,
    "vfo": "VFOA",
    "formatted": "14.250 MHz",
    "band": "20m"
  }
}
```

Write operations (`POST`) also include a human-readable `message`:

```json
{
  "status": "ok",
  "message": "Frequency set successfully",
  "data": {
    "frequency": 14250000,
    "vfo": "VFOA",
    "formatted": "14.250 MHz"
  }
}
```

---

## Error Handling

Errors return an appropriate HTTP status code along with a JSON body describing the problem.

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_FREQUENCY",
    "message": "Frequency 999000000 is outside the radio's supported range."
  }
}
```

| Status Code | Meaning                                                      |
| ----------- | ------------------------------------------------------------ |
| `200`       | OK — the request succeeded.                                  |
| `400`       | Bad Request — invalid or missing parameters.                 |
| `401`       | Unauthorized — missing or invalid API key.                   |
| `404`       | Not Found — the endpoint or resource does not exist.         |
| `409`       | Conflict — the radio/rotator is busy or in an invalid state. |
| `500`       | Internal Server Error — Hamlib or hardware communication failed. |
| `503`       | Service Unavailable — the radio/rotator is not connected.    |

---

## Endpoints

### Radio Control

#### Get Frequency

Retrieve the current operating frequency of the radio. Returns the frequency in Hz along with the active VFO and a human-readable formatted string.

```
GET /api/radio/frequency
```

**Query Parameters**

| Name  | Type   | Required | Description                                                  |
| ----- | ------ | -------- | ------------------------------------------------------------ |
| `vfo` | string | No       | Target VFO (e.g., `VFOA`, `VFOB`, `currVFO`). Defaults to `currVFO`. |

**Example Request**

```bash
curl -X GET "http://localhost:4532/api/radio/frequency?vfo=currVFO" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json"
```

**Example Response**

```json
{
  "status": "ok",
  "data": {
    "frequency": 14250000,
    "vfo": "VFOA",
    "formatted": "14.250 MHz",
    "band": "20m"
  }
}
```

---

#### Set Frequency

Set the operating frequency of the radio. Accepts frequency in Hz and optionally specifies which VFO to tune.

```
POST /api/radio/frequency
```

**Body Parameters**

| Name        | Type    | Required | Description                                            |
| ----------- | ------- | -------- | ------------------------------------------------------ |
| `frequency` | integer | Yes      | Target frequency in Hz (e.g., `14250000` for 14.250 MHz). |
| `vfo`       | string  | No       | Target VFO (e.g., `VFOA`, `VFOB`). Defaults to `currVFO`. |

**Example Request**

```bash
curl -X POST "http://localhost:4532/api/radio/frequency" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "frequency": 14250000,
    "vfo": "VFOA"
  }'
```

**Example Response**

```json
{
  "status": "ok",
  "message": "Frequency set successfully",
  "data": {
    "frequency": 14250000,
    "vfo": "VFOA",
    "formatted": "14.250 MHz"
  }
}
```

---

#### Get Mode

Get the current operating mode and passband width of the radio. Returns the mode identifier (e.g., `USB`, `LSB`, `CW`, `FM`) and the passband width in Hz.

```
GET /api/radio/mode
```

**Query Parameters**

| Name  | Type   | Required | Description                        |
| ----- | ------ | -------- | ----------------------------------- |
| `vfo` | string | No       | Target VFO. Defaults to `currVFO`. |

**Example Request**

```bash
curl -X GET "http://localhost:4532/api/radio/mode?vfo=currVFO" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json"
```

**Example Response**

```json
{
  "status": "ok",
  "data": {
    "mode": "USB",
    "passband_width": 2400,
    "vfo": "VFOA",
    "description": "Upper Sideband"
  }
}
```

---

### VFO Control

#### Get VFO

Get the currently active VFO (Variable Frequency Oscillator). Returns which VFO is currently selected for receive and transmit operations.

```
GET /api/radio/vfo
```

**Query Parameters**

_None._

**Example Request**

```bash
curl -X GET "http://localhost:4532/api/radio/vfo" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json"
```

**Example Response**

```json
{
  "status": "ok",
  "data": {
    "vfo": "VFOA",
    "split": false,
    "satmode": false
  }
}
```

---

#### Set VFO

Set the active VFO. Switch between VFOs for receive and transmit operations. Supports standard VFO identifiers.

```
POST /api/radio/vfo
```

**Body Parameters**

| Name  | Type   | Required | Description                                                   |
| ----- | ------ | -------- | --------------------------------------------------------------- |
| `vfo` | string | Yes      | VFO to select (`VFOA`, `VFOB`, `VFOC`, `currVFO`, `VFO`, `MEM`, `Main`, `Sub`). |

**Example Request**

```bash
curl -X POST "http://localhost:4532/api/radio/vfo" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "vfo": "VFOA"
  }'
```

**Example Response**

```json
{
  "status": "ok",
  "message": "VFO set successfully",
  "data": {
    "vfo": "VFOA"
  }
}
```

---

### Rotator Control

#### Get Position

Get the current antenna rotator position. Returns azimuth (0–360 degrees) and elevation (0–90 degrees) of the antenna.

```
GET /api/rotator/position
```

**Query Parameters**

_None._

**Example Request**

```bash
curl -X GET "http://localhost:4532/api/rotator/position" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json"
```

**Example Response**

```json
{
  "status": "ok",
  "data": {
    "azimuth": 180.5,
    "elevation": 45.0,
    "target_azimuth": 180.5,
    "target_elevation": 45.0,
    "moving": false
  }
}
```

---

#### Set Position

Set the antenna rotator position. Specify target azimuth and elevation for the antenna to move to. The rotator will begin moving immediately.

```
POST /api/rotator/position
```

**Body Parameters**

| Name        | Type   | Required | Description                                   |
| ----------- | ------ | -------- | ----------------------------------------------- |
| `azimuth`   | number | Yes      | Target azimuth in degrees (`0.0` – `360.0`).  |
| `elevation` | number | No       | Target elevation in degrees (`0.0` – `90.0`). Defaults to `0`. |

**Example Request**

```bash
curl -X POST "http://localhost:4532/api/rotator/position" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "azimuth": 180.5,
    "elevation": 45.0
  }'
```

**Example Response**

```json
{
  "status": "ok",
  "message": "Position set successfully",
  "data": {
    "azimuth": 180.5,
    "elevation": 45.0,
    "estimated_time": 12.5
  }
}
```

---

## VFO Reference

The API accepts the following standard Hamlib VFO identifiers:

| Identifier | Description                                 |
| ---------- | --------------------------------------------- |
| `VFOA`     | Primary VFO (A).                            |
| `VFOB`     | Secondary VFO (B).                          |
| `VFOC`     | Tertiary VFO (C), where supported.          |
| `currVFO`  | The currently active VFO.                   |
| `VFO`      | Generic VFO mode.                           |
| `MEM`      | Memory channel mode.                        |
| `Main`     | Main receiver (dual-receiver radios).       |
| `Sub`      | Sub receiver (dual-receiver radios).        |

---

## Rate Limiting

To protect the radio hardware from command flooding, the API enforces a default rate limit of **10 requests per second** per API key. Exceeding this limit returns a `429 Too Many Requests` response. Tune the limit in your server configuration if your hardware supports faster polling.

---

## Resources

- [Hamlib Project](https://hamlib.github.io/)
- [Hamlib on GitHub](https://github.com/Hamlib/Hamlib)
- [Hamlib Wiki & Supported Hardware](https://github.com/Hamlib/Hamlib/wiki)

---

_Hamlib API Documentation · v4.5.0_
