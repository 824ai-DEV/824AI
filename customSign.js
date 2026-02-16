// Custom signing script for electron-builder
// Signs executables with the 824AI certificate

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = async function(configuration) {
  const sign = configuration.sign;

  return async function(inputFile) {
    const certFile = path.join(__dirname, '824AI-cert.pfx');
    const certPassword = '824AI2026';

    // Check if certificate exists
    if (!fs.existsSync(certFile)) {
      console.warn("Certificate not found at " + certFile);
      console.warn("  Skipping code signing. Run create-cert.ps1 to generate it.");
      return;
    }

    try {
      console.log("Signing: " + path.basename(inputFile));
      
      // Use signtool.exe to sign the file
      // signtool is part of Windows SDK
      const cmd = "signtool.exe sign /f \"" + certFile + "\" /p \"" + certPassword + "\" /t http://timestamp.digicert.com /fd SHA256 \"" + inputFile + "\"";
      
      execSync(cmd, { stdio: 'inherit' });
      
      console.log("Signed: " + path.basename(inputFile));
    } catch (error) {
      // signtool not found or signing failed
      if (error.message.includes('not found') || error.message.includes('signtool')) {
        console.warn("signtool.exe not found (part of Windows SDK)");
        console.warn("  The executable will not be code signed.");
        console.warn("  Install Windows SDK or add signtool to PATH to enable signing.");
      } else {
        console.warn("Signing failed: " + error.message);
      }
      // Don't throw - allow build to continue without signing
    }
  };
};
