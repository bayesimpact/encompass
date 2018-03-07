export function getGoogleAnalyticsAppId(){
  return process.env.GA_ID || 'Unknown App ID'
}
