/**
 * Test script for Personal Color Analysis Service
 * Run with: BASE_URL=http://localhost:8080 node scripts/testPersonalColorAPI.js
 *
 * Requirements:
 * - Server running on http://localhost:8080
 * - Test image file (face image) in current directory or provide path
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BASE_URL = `${process.env.BASE_URL || "http://localhost:8080"}/v1/personal-color-service`;

// Gửi x-api-key cho mọi request nếu server bật API_KEY
if (process.env.API_KEY) {
  axios.defaults.headers.common["x-api-key"] = process.env.API_KEY;
}

/**
 * Test 1: Get available languages
 */
async function testGetAvailableLanguages() {
  console.log("\n📍 Test 1: Get Available Languages");
  console.log("=====================================\n");

  try {
    const response = await axios.get(`${BASE_URL}/languages`);

    console.log("✅ GET /languages endpoint working");
    console.log(`   Status: ${response.status}`);
    console.log(`   Languages count: ${response.data.data.count}`);
    console.log(`   Default language: ${response.data.data.defaultLanguage}`);
    console.log(
      `   Supported languages: ${response.data.data.languages.join(", ")}\n`,
    );

    return response.data.data.languages;
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message || error.message);
    return [];
  }
}

/**
 * Test 2: Analyze personal color from image (English)
 */
async function testAnalyzePersonalColor(imagePath, language = "en") {
  console.log(`\n📍 Test 2: Analyze Personal Color (Language: ${language})`);
  console.log("=====================================\n");

  try {
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  Image file not found at: ${imagePath}`);
      console.log("   Creating a sample test form for demonstration...\n");

      // For demo without actual image
      console.log("   This test requires an actual face image.\n");
      return null;
    }

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Prepare form data
    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", imageBuffer, "test_face.jpg");
    if (language !== "en") {
      form.append("language", language);
    }

    // Make request
    const response = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: form.getHeaders(),
    });

    console.log("✅ POST /analyze endpoint working");
    console.log(`   Status: ${response.status}`);
    console.log(
      `   Analysis:`,
      JSON.stringify(response.data.data.analysis, null, 2),
    );
    console.log(
      `   Metadata:`,
      JSON.stringify(response.data.data.metadata, null, 2),
    );

    return response.data.data.analysis;
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error("   Response details:", error.response.data);
    }
    return null;
  }
}

/**
 * Test 3: Analyze personal color with Vietnamese translation
 */
async function testAnalyzeWithTranslation(imagePath) {
  console.log(
    "\n📍 Test 3: Analyze Personal Color with Translation (Vietnamese)",
  );
  console.log("=====================================\n");

  try {
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  Image file not found at: ${imagePath}\n`);
      return null;
    }

    const imageBuffer = fs.readFileSync(imagePath);

    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", imageBuffer, "test_face.jpg");
    form.append("language", "vi");

    const response = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: form.getHeaders(),
    });

    console.log("✅ POST /analyze with language parameter working");
    console.log(`   Status: ${response.status}`);
    console.log(`   Language: ${response.data.data.metadata.language}`);
    console.log(
      `   Analysis (Vietnamese):`,
      JSON.stringify(response.data.data.analysis, null, 2),
    );

    return response.data.data.analysis;
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message || error.message);
    return null;
  }
}

/**
 * Test 4: Error handling - invalid language
 */
async function testErrorHandling() {
  console.log("\n📍 Test 4: Error Handling - Invalid Language");
  console.log("=====================================\n");

  try {
    // Try to create form with invalid language
    console.log('   Attempting to analyze with unsupported language "xx"...');

    // Create a dummy buffer for testing
    const dummyBuffer = Buffer.from("test");

    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", dummyBuffer, "test.jpg");
    form.append("language", "xx"); // Invalid language

    const response = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: form.getHeaders(),
      validateStatus: () => true, // Don't throw on error status
    });

    if (response.status === 400) {
      console.log("✅ Correctly rejected invalid language");
      console.log(`   Error message: ${response.data.message}\n`);
    } else {
      console.log("⚠️  Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

/**
 * Test 5: Error handling - missing image
 */
async function testMissingImageError() {
  console.log("\n📍 Test 5: Error Handling - Missing Image");
  console.log("=====================================\n");

  try {
    console.log("   Attempting to analyze without image file...");

    const FormData = require("form-data");
    const form = new FormData();
    // Don't add any file - test error handling

    const response = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: form.getHeaders(),
      validateStatus: () => true,
    });

    if (response.status === 400) {
      console.log("✅ Correctly rejected missing image");
      console.log(`   Error message: ${response.data.message}\n`);
    } else {
      console.log("⚠️  Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

/**
 * Validate response structure
 */
function validateResponseStructure(analysis) {
  console.log("\n📍 Test 6: Validate Response Structure");
  console.log("=====================================\n");

  const issues = [];

  // Check undertone
  if (
    !analysis.undertone ||
    !analysis.undertone.value ||
    !analysis.undertone.explain
  ) {
    issues.push("❌ Missing or incomplete undertone field");
  } else {
    const validUndertones = [
      "warm",
      "cool",
      "neutral",
      "neutral_warm",
      "neutral_cool",
    ];
    if (!validUndertones.includes(analysis.undertone.value)) {
      issues.push(`❌ Invalid undertone value: ${analysis.undertone.value}`);
    } else {
      console.log(`✅ Undertone valid: ${analysis.undertone.value}`);
    }
  }

  // Check subseason
  if (
    !analysis.subseason ||
    !analysis.subseason.value ||
    !analysis.subseason.explain
  ) {
    issues.push("❌ Missing or incomplete subseason field");
  } else {
    const validSubseasons = [
      "bright_spring",
      "light_spring",
      "warm_spring",
      "soft_summer",
      "light_summer",
      "cool_summer",
      "soft_autumn",
      "warm_autumn",
      "deep_autumn",
      "cool_winter",
      "bright_winter",
      "deep_winter",
    ];
    if (!validSubseasons.includes(analysis.subseason.value)) {
      issues.push(`❌ Invalid subseason value: ${analysis.subseason.value}`);
    } else {
      console.log(`✅ Subseason valid: ${analysis.subseason.value}`);
    }
  }

  // Check skintone
  if (!analysis.skintone) {
    issues.push("❌ Missing skintone");
  } else {
    const validSkintones = [
      "fair",
      "light",
      "light_medium",
      "medium",
      "medium_tan",
      "tan",
      "deep",
    ];
    if (!validSkintones.includes(analysis.skintone)) {
      issues.push(`❌ Invalid skintone value: ${analysis.skintone}`);
    } else {
      console.log(`✅ Skintone valid: ${analysis.skintone}`);
    }
  }

  // Check detail array
  if (!Array.isArray(analysis.detail) || analysis.detail.length === 0) {
    issues.push("❌ Missing or empty detail array");
  } else {
    console.log(`✅ Detail array valid: ${analysis.detail.length} entries`);
    const totalPercentage = analysis.detail.reduce(
      (sum, item) => sum + item.percentage,
      0,
    );
    if (totalPercentage < 95 || totalPercentage > 105) {
      issues.push(
        `⚠️  Detail percentages sum to ${totalPercentage}, expected ~100`,
      );
    } else {
      console.log(`✅ Detail percentages sum correctly: ${totalPercentage}%`);
    }
  }

  // Check description
  if (!analysis.description) {
    issues.push("❌ Missing description");
  } else {
    console.log("✅ Description present");
  }

  if (issues.length === 0) {
    console.log("\n✅ All response structure validations passed!\n");
  } else {
    console.log("\n" + issues.join("\n") + "\n");
  }

  return issues.length === 0;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log("\n");
  console.log(
    "╔════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║        Personal Color Analysis API - Test Suite                ║",
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝",
  );

  // Check if server is running
  try {
    await axios.get(`${BASE_URL}/languages`, { timeout: 3000 });
  } catch (error) {
    console.error(
      "\n❌ Server not responding. Make sure the server is running on http://localhost:8080\n",
    );
    process.exit(1);
  }

  // Test 1: Get available languages
  const languages = await testGetAvailableLanguages();

  // Test 2-5: Prepare image path (user should provide this)
  const imagePath = process.argv[2] || "test_face.jpg";

  // Basic tests
  await testAnalyzePersonalColor(imagePath, "en");
  await testAnalyzeWithTranslation(imagePath);

  // Error handling tests
  await testErrorHandling();
  await testMissingImageError();

  // If analysis succeeded, validate structure
  const analysisResult = await testAnalyzePersonalColor(imagePath, "en");
  if (analysisResult) {
    validateResponseStructure(analysisResult);
  }

  console.log("\n");
  console.log(
    "╔════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║                     Test Suite Complete                         ║",
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝\n",
  );

  console.log("📝 Notes:");
  console.log(
    "   - To test with a real image: node src/scripts/testPersonalColorAPI.js /path/to/face/image.jpg",
  );
  console.log("   - API endpoints:");
  console.log(
    "     POST /v1/personal-color-service/analyze (multipart: file, language)",
  );
  console.log("     GET  /v1/personal-color-service/languages\n");
}

// Run tests
runTests().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
