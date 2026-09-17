# Personal Color Analysis API Documentation

## Overview

The Personal Color Analysis API analyzes a person's personal color characteristics based on a face image using AI-powered color theory. It provides comprehensive color recommendations suitable for personal styling and wardrobe selection.

### What is Personal Color Analysis?

Personal color analysis (also known as color typing or seasonal color analysis) is a method of identifying colors that best complement a person's natural coloring. The analysis is based on three main characteristics:

1. **Undertone**: The underlying color of the skin (warm, cool, or neutral)
2. **Subseason**: The seasonal color classification from the 12-season color system (Spring, Summer, Autumn, Winter variations)
3. **Skin Tone**: The depth/lightness of the skin from fair to deep

---

## API Endpoints

### 1. Analyze Personal Color

**Endpoint:** `POST /v1/personal-color-service/analyze`

**Description:** Analyzes a person's personal color characteristics from a face image.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

| Parameter         | Type          | Required | Description                                                                                                                                                                                                                                                           |
| ----------------- | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file` or `image` | File (Binary) | Yes      | Face image file. Clear frontal view with natural lighting preferred. Supported formats: JPG, PNG, JPEG, WEBP                                                                                                                                                          |
| `language`        | String        | No       | ISO 639-1 language code for response translation (default: `en`). Supported: `en`, `vi`, `zh`, `fr`, `de`, `ja`, `ko`, `es`, `ru`, `pt`, `it`, `ar`, `hi`, `bn`, `th`, `id`, `ms`, `nl`, `tr`, `pl`, `sv`, `uk`, `ro`, `cs`, `hu`, `el`, `da`, `fi`, `no`, `he`, `bg` |

#### Response

**Status Code:** `200 OK`

**Content-Type:** `application/json`

```json
{
  "statusCode": 200,
  "message": "Personal color analysis completed successfully",
  "data": {
    "analysis": {
      "undertone": {
        "value": "warm|cool|neutral|neutral_warm|neutral_cool",
        "explain": "2-3 sentence explanation of undertone determination"
      },
      "subseason": {
        "value": "bright_spring|light_spring|warm_spring|soft_summer|light_summer|cool_summer|soft_autumn|warm_autumn|deep_autumn|cool_winter|bright_winter|deep_winter",
        "explain": "2-3 sentence explanation of why this subseason matches best"
      },
      "skintone": "fair|light|light_medium|medium|medium_tan|tan|deep",
      "detail": [
        {
          "season": "subseason_value",
          "percentage": 50
        },
        {
          "season": "subseason_value",
          "percentage": 30
        }
      ],
      "description": "Comprehensive explanation of why detail percentages are distributed this way, e.g., 'You mostly match Warm Autumn (50%) due to your deep warm coloring and golden undertone. Soft Autumn (30%) and Warm Spring (20%) may also complement your palette.'"
    },
    "metadata": {
      "language": "en",
      "timestamp": "2026-04-17T10:30:00Z"
    }
  }
}
```

#### Response Field Descriptions

**undertone**

- **value**: The primary undertone category
  - `warm`: Golden, peachy, or orange undertones
  - `cool`: Pink, red, or blue undertones
  - `neutral`: Balanced undertones without clear preference
  - `neutral_warm`: Slightly more warm-leaning neutral
  - `neutral_cool`: Slightly more cool-leaning neutral
- **explain**: Why this undertone was determined (2-3 sentences)

**subseason**

- **value**: The 12-season color classification
  - **Spring**: `bright_spring`, `light_spring`, `warm_spring`
  - **Summer**: `light_summer`, `soft_summer`, `cool_summer`
  - **Autumn**: `soft_autumn`, `warm_autumn`, `deep_autumn`
  - **Winter**: `cool_winter`, `bright_winter`, `deep_winter`
- **explain**: Why this subseason is the primary match (2-3 sentences)

**skintone**: The depth level of skin coloring

- `fair`: Very light skin
- `light`: Pale, light skin
- `light_medium`: Light to medium skin
- `medium`: Medium skin tone
- `medium_tan`: Medium with tan
- `tan`: Tan/medium-deep
- `deep`: Deep, dark skin

**detail**: Array of potential subseason matches with percentage compatibility

- Typically 2-3 subseasons listed
- Percentages represent likelihood of match (should sum to ~100%)
- Ordered by percentage (highest first)

**description**: Explanation of the color palette breakdown and why the specific percentages were assigned

#### Error Responses

**400 Bad Request** - Missing or invalid image

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "No image file uploaded. Please provide an image file."
}
```

**400 Bad Request** - Invalid face image

```json
{
  "statusCode": 400,
  "error": "INVALID_FACE_IMAGE",
  "message": "Image must contain a clear human face. The image provided does not show a valid human face."
}
```

**400 Bad Request** - Unsupported language

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Unsupported language: xx. Supported languages: en, vi, zh, ..."
}
```

**500 Internal Server Error**

```json
{
  "statusCode": 500,
  "error": "ANALYSIS_FAILED",
  "message": "Failed to analyze personal color. Please try again with a different image."
}
```

#### Example Request

**cURL:**

```bash
curl -X POST http://localhost:8080/v1/personal-color-service/analyze \
  -F "file=@/path/to/face_image.jpg" \
  -F "language=en"
```

**Python (requests):**

```python
import requests

url = 'http://localhost:8080/v1/personal-color-service/analyze'
files = {'file': open('face_image.jpg', 'rb')}
data = {'language': 'en'}

response = requests.post(url, files=files, data=data)
result = response.json()
```

**JavaScript (fetch):**

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("language", "en");

const response = await fetch("/v1/personal-color-service/analyze", {
  method: "POST",
  body: formData,
});

const result = await response.json();
```

**Node.js (axios + form-data):**

```javascript
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const form = new FormData();
form.append("file", fs.createReadStream("face_image.jpg"));
form.append("language", "en");

axios
  .post("/v1/personal-color-service/analyze", form, {
    headers: form.getHeaders(),
  })
  .then((response) => {
    console.log(response.data);
  });
```

---

### 2. Get Available Languages

**Endpoint:** `GET /v1/personal-color-service/languages`

**Description:** Returns the list of supported language codes for response translation.

#### Request

No request body required.

#### Response

**Status Code:** `200 OK`

```json
{
  "statusCode": 200,
  "message": "Available languages retrieved successfully",
  "data": {
    "languages": [
      "en",
      "vi",
      "zh",
      "fr",
      "de",
      "ja",
      "ko",
      "es",
      "ru",
      "pt",
      "it",
      "ar",
      "hi",
      "bn",
      "th",
      "id",
      "ms",
      "nl",
      "tr",
      "pl",
      "sv",
      "uk",
      "ro",
      "cs",
      "hu",
      "el",
      "da",
      "fi",
      "no",
      "he",
      "bg"
    ],
    "count": 31,
    "defaultLanguage": "en"
  }
}
```

#### Example Request

**cURL:**

```bash
curl http://localhost:8080/v1/personal-color-service/languages
```

**JavaScript (fetch):**

```javascript
const response = await fetch("/v1/personal-color-service/languages");
const result = await response.json();
console.log(result.data.languages);
```

---

## Color Classification Reference

### 12-Season Color System

The 12-season color system divides personal color into 12 subseasons based on two dimensions:

**Spring** (Warm, Light/Medium, Clear)

- **Bright Spring**: Clear, bright coloring with warm undertones
- **Light Spring**: Light, delicate coloring with warm undertones
- **Warm Spring**: Warm, earthy coloring with golden undertones

**Summer** (Cool, Light/Medium, Soft)

- **Light Summer**: Light, delicate coloring with cool undertones
- **Soft Summer**: Medium coloring with subtle cool undertones
- **Cool Summer**: Cool, clear coloring with strong cool undertones

**Autumn** (Warm, Deep, Muted)

- **Soft Autumn**: Medium coloring with warm undertones, soft saturation
- **Warm Autumn**: Deep, warm coloring with golden undertones
- **Deep Autumn**: Very deep, rich coloring with warm undertones

**Winter** (Cool, Deep/Clear)

- **Cool Winter**: Deep, cool coloring with strong cool undertones
- **Bright Winter**: Clear, bright coloring with cool undertones
- **Deep Winter**: Very deep, dark coloring with cool undertones

### Undertone Categories

**Warm Undertones**

- Golden, peachy, or orange hues
- Gold jewelry appears more flattering
- Warm colors are more complementary

**Cool Undertones**

- Pink, red, or blue hues
- Silver jewelry appears more flattering
- Cool colors are more complementary

**Neutral Undertones**

- Both gold and silver jewelry look good
- Can wear both warm and cool colors effectively
- May lean slightly warm or cool

---

## Usage Guidelines

### Image Requirements

**Best Results:**

- Natural daylight or professional studio lighting
- Frontal view of face
- Clean, unobstructed facial features
- Minimal makeup (natural makeup is acceptable)
- No face filters or extreme editing
- High resolution (at least 400x400 pixels recommended)

**Avoid:**

- Cartoon or drawn faces
- Faces with heavy makeup obscuring natural coloring
- Faces with masks or obstructions
- Extreme photo filters or heavy Photoshop
- Very low-resolution images
- Extreme angles or poses

### Language Support

The API supports 31 languages. Response descriptions and explanations will be translated to the requested language while maintaining structure and accuracy.

### Response Interpretation

**Understanding Detail Percentages:**

- Primary match (typically 40-70%): Best color classification
- Secondary matches (typically 15-40%): Colors that also work well
- Tertiary matches (rarely >10%): May also be flattering

**Using the Results:**

- Focus on colors from the primary subseason
- Experiment with colors from secondary matches
- Undertone helps with metallic choices (gold vs. silver)
- Skin tone helps with color depth selection

---

## Integration Examples

### React Component

```javascript
import React, { useState } from "react";

export function PersonalColorAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch("/v1/personal-color-service/analyze", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setAnalysis(result.data.analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Analyzing...</div>;

  if (!analysis) {
    return (
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="vi">Vietnamese</option>
        </select>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Personal Color</h2>
      <p>
        <strong>Undertone:</strong> {analysis.undertone.value}
      </p>
      <p>{analysis.undertone.explain}</p>

      <p>
        <strong>Subseason:</strong> {analysis.subseason.value}
      </p>
      <p>{analysis.subseason.explain}</p>

      <p>
        <strong>Skin Tone:</strong> {analysis.skintone}
      </p>
      <p>{analysis.description}</p>
    </div>
  );
}
```

---

## API Response Times

Typical response times:

- Image upload: < 1 second
- AI analysis: 5-15 seconds (depending on Gemini API load)
- Translation (if requested): 2-5 seconds additional
- **Total**: 7-20 seconds typical response time

---

## Error Handling Best Practices

```javascript
async function analyzePersonalColor(file, language = "en") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);

  try {
    const response = await fetch("/v1/personal-color-service/analyze", {
      method: "POST",
      body: formData,
    });

    if (response.status === 400) {
      const error = await response.json();
      console.error("Validation error:", error.message);
      // Show user-friendly message
      return null;
    }

    if (response.status === 500) {
      console.error("Server error - try again later");
      return null;
    }

    const result = await response.json();
    return result.data.analysis;
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}
```

---

## Troubleshooting

### "Image must contain a clear human face"

**Cause:** The upload image doesn't show a clear human face.

**Solution:**

- Ensure image is clear and frontal view
- Remove any masks, glasses, or obstructions
- Use well-lit photos (avoid shadows)
- Ensure the face takes up a reasonable portion of the image

### "Unsupported language" error

**Cause:** Language code not in the supported list.

**Solution:**

- Call `/languages` endpoint to verify supported codes
- Use ISO 639-1 two-letter language codes
- Default to 'en' if unsure

### Slow response times

**Cause:** Gemini API load or network latency.

**Solution:**

- Retry the request after a few seconds
- Implement timeout and retry logic
- Consider caching duplicate requests

---

## Performance Considerations

- Image file size: Keep under 10MB for best results
- Concurrent requests: API supports multiple simultaneous requests
- Rate limiting: No documented rate limits, but follow best practices
- Caching: Consider caching analysis results by image hash if re-analyzing same image

---

## API Versioning

Current API Version: **v1**

The API is located at `/v1/personal-color-service/`

Future versions will maintain backward compatibility or provide migration guides.

---

## Support

For issues, feature requests, or questions:

- Check API documentation at `/docs` (Swagger UI available)
- Review error messages carefully
- Contact development team with detailed error logs

---

## License & Attribution

Personal Color Analysis uses the 12-season color analysis system based on professional color theory and styling standards.

**Last Updated:** April 2026  
**API Version:** 1.0.0
