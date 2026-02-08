# Zimin Ran - Personal Homepage

A clean, Wikipedia-style personal homepage showcasing education background, publications, and professional information.

## Education Background

- **Ph.D.** - Computer Science, University of Technology Sydney
- **Master's Degree** - Data Science, University of Sydney
- **Double Bachelor's Degree** - Accounting and Finance, Liaoning University (211) and De Montfort University, UK

## Publications

1. Zimin Ran, Xingyu Ren, Xiang An, Kaicheng Yang, Ziyong Feng, Jing Yang, Rolandos Alexandros Potamias, Linchao Zhu, Jiankang Deng. "HUST: High-Fidelity Unbiased Skin Tone Estimation via Texture Quantization." In ICCV, 2025.

2. Yin Xie, Kaicheng Yang, Xiang An, Kun Wu, Yongle Zhao, Weimo Deng, Zimin Ran, Yumeng Wang, Ziyong Feng, Roy Miles, Ismail Elezi, Jiankang Deng. "Region-based Cluster Discrimination for Visual Representation Learning." In ICCV, 2025.

3. Feilong Tang, Xiang An, Haolin Yang, Yin Xie, Kaicheng Yang, Ming Hu, Zheng Cheng, Xingyu Zhou, Zimin Ran, Imran Razzak, Ziyong Feng, Behzad Bozorgtabar, Jiankang Deng, Zongyuan Ge. "UniViT: Unifying Image and Video Understanding in One Vision Encoder." In NeurIPS, 2025.

## Deployment Instructions

### Local Deployment

You can deploy this personal homepage locally using any of the following methods:

#### Method 1: Python HTTP Server (Recommended)

1. Open a terminal and navigate to the project directory:
   ```bash
   cd aha_rabbit.github.io
   ```

2. Start a simple HTTP server:
   
   **Python 3:**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

3. Open your browser and visit: `http://localhost:8000`

#### Method 2: Node.js HTTP Server

1. Install `http-server` globally (one-time setup):
   ```bash
   npm install -g http-server
   ```

2. Navigate to the project directory and start the server:
   ```bash
   cd aha_rabbit.github.io
   http-server -p 8000
   ```

3. Open your browser and visit: `http://localhost:8000`

#### Method 3: PHP Built-in Server

1. Navigate to the project directory:
   ```bash
   cd aha_rabbit.github.io
   ```

2. Start PHP's built-in server:
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and visit: `http://localhost:8000`

#### Method 4: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The page will automatically open in your default browser

### GitHub Pages Deployment

Deploy your personal homepage to GitHub Pages for free hosting:

#### Step 1: Prepare Your Repository

1. Make sure your repository is named `username.github.io` (where `username` is your GitHub username)
   - For example: `ziminran.github.io`

2. Ensure all files are committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Update personal homepage"
   git push origin main
   ```

#### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/username/username.github.io`
2. Click on **Settings** tab
3. Scroll down to the **Pages** section in the left sidebar
4. Under **Source**, select:
   - **Branch:** `main` (or `master`)
   - **Folder:** `/ (root)`
5. Click **Save**

#### Step 3: Access Your Website

- Your website will be available at: `https://username.github.io`
- For example: `https://ziminran.github.io`
- It may take a few minutes for the site to be published initially

#### Using a Custom Domain (Optional)

1. Purchase a domain from any domain registrar
2. In your repository, create a file named `CNAME` in the root directory with your domain:
   ```
   yourdomain.com
   ```
3. Configure your domain's DNS settings:
   - Add an `A` record pointing to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `username.github.io`
4. In GitHub repository settings under Pages, enter your custom domain and enable HTTPS

## Features

- 📱 Responsive design (mobile-friendly)
- 🎨 Wikipedia-style clean interface
- 📚 Dedicated sections for education and publications
- 🔗 Social media links (GitHub, Email)
- 🌐 Multi-language support (Chinese)

## Customization

To customize this homepage for your own use:

1. **Edit `index.html`:**
   - Update personal information in the main content area
   - Modify the infobox with your details
   - Update links to your GitHub and email

2. **Replace profile picture:**
   - Replace `assets/img/profile_pic.svg` with your own image (supports .jpg, .png, or .svg formats)
   - Update the image reference in `index.html` if you change the filename or format

3. **Update `README.md`:**
   - Replace education and publication information with your own

## License

This project is open source and available for personal use.
