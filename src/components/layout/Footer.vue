<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>JSON Visualizer</h4>
        <p class="footer-description">
          Interactive tool for visualizing, formatting, and transforming JSON data with advanced features.
        </p>
      </div>
      
      <div class="footer-section">
        <h5>Features</h5>
        <ul class="footer-links">
          <li><router-link to="/visualizer">Visualizer</router-link></li>
          <li><router-link to="/converter">Converter</router-link></li>
          <li><router-link to="/validator">Validator</router-link></li>
          <li><router-link to="/tools">Tools</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h5>Privacy</h5>
        <p class="privacy-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          All data processing is done locally in your browser. Nothing is stored on our servers.
        </p>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2025 JSON Visualizer. All rights reserved.</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-2xl $spacing-md $spacing-lg;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.footer-section {
  h4, h5 {
    margin-bottom: $spacing-md;
    color: var(--text-primary);
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1rem;
  }
}

.footer-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.footer-links {
  list-style: none;
  
  li {
    margin-bottom: $spacing-xs;
  }
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--primary);
    }
  }
}

.privacy-note {
  display: flex;
  align-items: flex-start;
  gap: $spacing-xs;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 0;

  svg {
    color: var(--accent);
    margin-top: 2px;
    flex-shrink: 0;
  }
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: $spacing-md;
  text-align: center;
  
  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.75rem;
  }
}
</style>
