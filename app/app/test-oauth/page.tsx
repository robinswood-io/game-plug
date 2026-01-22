import { OAuthTestButtons } from '@/components/auth/OAuthTestButtons';

export default function TestOAuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            OAuth PKCE Implementation Test
          </h1>
          <p className="text-gray-600">
            Test PKCE utilities for secure OAuth authentication
          </p>
        </div>

        <OAuthTestButtons />

        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-3">📋 Test Checklist</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>Click "Generate PKCE Parameters" to create random code_verifier and code_challenge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>Verify code_verifier is 128 characters (base64url format)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>Verify code_challenge is 43 characters (SHA-256 base64url = 43 chars)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>Check browser console for detailed logs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">5.</span>
              <span>Click "Check sessionStorage" to verify verifier is stored</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">6.</span>
              <span>Test "Google OAuth" or "Azure OAuth" to see OAuth URL with PKCE params</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
