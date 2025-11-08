# Voice of Chitral - End-to-End Testing Checklist

## 🧪 Complete Testing Guide

Use this checklist to test all features of Voice of Chitral after deployment.

---

## 1. Authentication Testing

### Register New Account
- [ ] Visit homepage
- [ ] Click "Sign up" or go to `/register`
- [ ] Fill in registration form:
  - Display Name: Your Name
  - Username: username123
  - Email: test@example.com
  - Password: test123456
- [ ] Click "Sign up" button
- [ ] Verify you're redirected to home page
- [ ] Verify you're logged in (check profile icon in header)

### Login
- [ ] Logout (from profile menu)
- [ ] Go to `/login`
- [ ] Enter email and password
- [ ] Click "Log in"
- [ ] Verify successful login
- [ ] Verify redirection to home page

### Social Login (Optional - requires OAuth setup)
- [ ] Try "Continue with Google" button
- [ ] Try "Continue with Facebook" button

---

## 2. Home Page Testing

- [ ] Verify "Trending Now" section loads
- [ ] Verify "Popular Artists" section loads
- [ ] Verify "New Releases" section loads
- [ ] Verify "Recent Albums" section loads
- [ ] Click on a song card - should show play button
- [ ] Click on an artist card - should navigate to artist page
- [ ] Click on an album card - should navigate to album page
- [ ] Click "See all" links - should navigate to browse/category pages

---

## 3. Search Functionality

### Basic Search
- [ ] Go to `/search` or click search icon
- [ ] Type a search query (e.g., "folk")
- [ ] Press Enter or click search
- [ ] Verify results appear

### Filtered Search
- [ ] Click "Songs" tab - verify only songs show
- [ ] Click "Artists" tab - verify only artists show
- [ ] Click "Albums" tab - verify only albums show
- [ ] Click "Playlists" tab - verify only playlists show
- [ ] Click "All" tab - verify all results show

### Search Features
- [ ] Verify "Top Result" section shows
- [ ] Click on a search result
- [ ] Verify navigation works correctly
- [ ] Try searching with no results - verify "No results" message

---

## 4. Browse Page

- [ ] Go to `/browse`
- [ ] Verify category cards load (Folk, Traditional, Modern, etc.)
- [ ] Verify "All Songs" section loads
- [ ] Verify "All Artists" section loads
- [ ] Verify "All Albums" section loads
- [ ] Click on a category - should filter/navigate
- [ ] Click on any song/artist/album - should navigate to detail page

---

## 5. Artist Page

- [ ] Click on any artist from home/browse/search
- [ ] Verify artist image loads
- [ ] Verify artist name and follower count show
- [ ] Verify verified badge shows (if artist is verified)
- [ ] Verify "About" section shows bio
- [ ] Verify "Popular" songs list loads
- [ ] Verify "Albums" section loads

### Artist Actions
- [ ] Click "Play" button - should start playing artist's top song
- [ ] Click "Follow" button - should follow artist
- [ ] Verify button changes to "Following"
- [ ] Click "Following" to unfollow
- [ ] Click on a song - should play
- [ ] Click on an album - should navigate to album page

---

## 6. Album Page

- [ ] Click on any album from home/browse/artist page
- [ ] Verify album cover loads
- [ ] Verify album title shows
- [ ] Verify artist name shows (should be a link)
- [ ] Verify release year shows
- [ ] Verify track count shows
- [ ] Verify total duration shows
- [ ] Verify track list loads

### Album Actions
- [ ] Click "Play" button - should play album from track 1
- [ ] Click on individual track - should play that track
- [ ] Verify track numbers show
- [ ] Verify track durations show
- [ ] Click artist name - should navigate to artist page

---

## 7. Playlist Page (If you have playlists)

- [ ] Navigate to a playlist
- [ ] Verify playlist name shows
- [ ] Verify creator name shows
- [ ] Verify song count shows
- [ ] Verify track list loads

### Playlist Actions
- [ ] Click "Play" button - should play playlist
- [ ] Click "Follow" button (if not owner)
- [ ] Click on a song - should play
- [ ] Verify songs can be removed (if owner)

---

## 8. Library Page

- [ ] Go to `/library` or click Library in sidebar
- [ ] Verify "Liked Songs" card shows with count
- [ ] Verify "Recently Played" card shows
- [ ] Verify "Playlists" card shows with count
- [ ] Click "Liked Songs" - should navigate to liked songs page
- [ ] Click "Recently Played" - should show history
- [ ] Click "Playlists" - should show user playlists

### Create Playlist (If implemented)
- [ ] Click "Create Playlist" button
- [ ] Fill in playlist details
- [ ] Save playlist
- [ ] Verify playlist appears in library

---

## 9. Music Player Testing

### Basic Playback
- [ ] Play any song
- [ ] Verify song title shows in player
- [ ] Verify artist name shows
- [ ] Verify album art shows
- [ ] Verify progress bar moves
- [ ] Verify current time updates
- [ ] Verify total duration shows

### Player Controls
- [ ] Click Play/Pause button - should work
- [ ] Click Next button - should play next song
- [ ] Click Previous button - should go to previous song
- [ ] Drag progress bar - should seek to position
- [ ] Click on progress bar - should seek to position

### Volume Controls
- [ ] Click volume icon
- [ ] Drag volume slider - should adjust volume
- [ ] Click mute button - should mute
- [ ] Click unmute - should restore volume

### Repeat & Shuffle
- [ ] Click repeat button - should cycle through modes (off → all → one)
- [ ] Verify repeat one loops current song
- [ ] Verify repeat all loops entire queue
- [ ] Click shuffle button - should shuffle queue
- [ ] Verify shuffle icon shows active state

### Queue Management
- [ ] Click queue icon (if visible)
- [ ] Verify current song shows
- [ ] Verify upcoming songs show
- [ ] Click on a song in queue - should jump to it
- [ ] Try removing song from queue
- [ ] Try reordering queue (if implemented)

---

## 10. Profile & Settings

- [ ] Go to `/profile` or click profile icon
- [ ] Verify user info shows (name, username, email)
- [ ] Verify premium badge shows (if premium user)

### Update Profile
- [ ] Click "Profile" tab
- [ ] Change display name
- [ ] Change email
- [ ] Click "Save Changes"
- [ ] Verify success message
- [ ] Verify changes are saved

### Change Password
- [ ] Click "Password" tab
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Click "Update Password"
- [ ] Verify success message
- [ ] Try logging out and back in with new password

### Logout
- [ ] Click "Log Out" button
- [ ] Verify you're logged out
- [ ] Verify redirect to login page

---

## 11. Like/Unlike Features

### Like Songs
- [ ] Find any song
- [ ] Click heart/like icon
- [ ] Verify icon fills/changes color
- [ ] Go to "Liked Songs" in library
- [ ] Verify song appears in liked songs

### Unlike Songs
- [ ] Click heart icon again on liked song
- [ ] Verify icon empties
- [ ] Check "Liked Songs" - song should be removed

---

## 12. Follow/Unfollow Features

### Follow Artist
- [ ] Go to artist page
- [ ] Click "Follow" button
- [ ] Verify button changes to "Following"
- [ ] Check your library - artist should appear in followed artists

### Unfollow Artist
- [ ] Click "Following" button
- [ ] Verify button changes back to "Follow"

### Follow Playlist
- [ ] Go to any public playlist (not yours)
- [ ] Click "Follow" button
- [ ] Verify button changes to "Following"
- [ ] Check library - playlist should appear

---

## 13. Responsive Design Testing

### Desktop (1920x1080)
- [ ] Open site in full screen desktop
- [ ] Verify all elements are properly sized
- [ ] Verify sidebar is visible
- [ ] Verify player is at bottom
- [ ] Test all features

### Tablet (768x1024)
- [ ] Resize browser or use device
- [ ] Verify responsive layout adapts
- [ ] Verify sidebar collapses to hamburger menu
- [ ] Verify cards stack properly
- [ ] Test navigation

### Mobile (375x667)
- [ ] Open on mobile device or resize browser
- [ ] Verify mobile navigation shows at bottom
- [ ] Verify hamburger menu works
- [ ] Verify player adapts to mobile size
- [ ] Try playing a song
- [ ] Try searching
- [ ] Test all core features

---

## 14. Performance Testing

- [ ] Measure initial page load time (should be < 3 seconds)
- [ ] Test smooth scrolling on home page
- [ ] Verify images load properly
- [ ] Test song playback starts quickly (< 2 seconds)
- [ ] Verify no lag when navigating between pages
- [ ] Check browser console for errors (should be none)
- [ ] Check network tab for failed requests

---

## 15. Browser Compatibility

Test in these browsers:

### Chrome
- [ ] All features work
- [ ] Audio playback works
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Audio playback works
- [ ] No console errors

### Safari (Mac/iOS)
- [ ] All features work
- [ ] Audio playback works
- [ ] No console errors

### Edge
- [ ] All features work
- [ ] Audio playback works
- [ ] No console errors

---

## 16. Error Handling

### Network Errors
- [ ] Turn off backend server
- [ ] Try loading pages
- [ ] Verify error messages show
- [ ] Verify no crashes

### Invalid URLs
- [ ] Go to `/artist/invalid-id`
- [ ] Verify proper error handling
- [ ] Try `/album/invalid-id`
- [ ] Try `/playlist/invalid-id`

### No Data Scenarios
- [ ] Login with new user (no liked songs, no playlists)
- [ ] Verify empty states show properly
- [ ] Verify "Create Playlist" prompts show

---

## 17. Admin Integration

### Upload Content via Admin Panel
- [ ] Login to admin panel
- [ ] Upload a new song
- [ ] Upload artist image
- [ ] Create album

### Verify in Frontend
- [ ] Refresh frontend
- [ ] New song should appear in "New Releases"
- [ ] Artist should appear in "Popular Artists"
- [ ] Album should appear in "Recent Albums"
- [ ] Search for new content - should be findable
- [ ] Play new song - should work

---

## 🐛 Bug Reporting Template

If you find issues, report them with:

```
**Issue:** Brief description
**Page:** Which page (e.g., Home, Artist, Player)
**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected:** What should happen
**Actual:** What actually happened
**Browser:** Chrome 120 / Firefox 115 / Safari 17
**Device:** Desktop / Mobile / Tablet
**Screenshot:** (if possible)
**Console Errors:** (from browser console)
```

---

## ✅ Testing Complete Checklist

After completing all tests above:

- [ ] All authentication flows work
- [ ] All pages load correctly
- [ ] All navigation links work
- [ ] Music playback works
- [ ] Player controls work
- [ ] Search works
- [ ] Like/Unlike works
- [ ] Follow/Unfollow works
- [ ] Profile settings work
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Performance is good
- [ ] Works in all major browsers

---

**Once testing is complete, provide feedback on:**
1. What's working well ✅
2. What's not working ❌
3. What could be improved 💡
4. Any bugs or issues 🐛
5. Features you'd like to add ✨
