class RareCompare {
    constructor() {
        this.outfitData = [];
        this.currentOutfit = null;
        this.currentProductImage = 0;
        this.currentLookbookImage = 0;
        this.currentVirtualImage = 0;
        this.currentVirtualTryonIndex = 0; // 新增：当前虚拟试穿图片索引
        this.isGenerating = false;
        this.currentGender = 'women'; // 默认女装
        
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            await this.loadOutfitData();
            this.renderOutfitDropdown();
            this.bindEvents();
            
            // 初始化虚拟试穿界面，确保显示默认占位符
            this.resetVirtualTryonInterface();
            
            this.showLoading(false);
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载失败，请刷新页面重试');
            this.showLoading(false);
        }
    }

    async loadOutfitData() {
        // 新的lookbook数据，使用reblue_compare_lookbook文件夹
        const lookbookFolders = [
            '003', '004', '006', '015', '036', '040', '041', '086', '176'
        ];

        // 加载lookbook数据
        const lookbookData = await Promise.all(
            lookbookFolders.map(async (folder) => {
                const outfit = await this.loadOutfitFolder(folder, 'lookbook');
                return outfit;
            })
        );

        // 存储所有数据
        this.allOutfitData = {
            women: lookbookData.filter(outfit =>
                outfit.productImages.length > 0 || outfit.lookbookImages.length > 0 || outfit.virtualTryonImages.length > 0
            ),
            men: [] // 暂时没有男装数据
        };

        // 设置当前显示的数据
        this.outfitData = this.allOutfitData[this.currentGender];

        console.log('加载完成的套装数据:', this.allOutfitData);
    }

    async loadOutfitFolder(folderName, gender = 'lookbook') {
        const outfit = {
            id: folderName,
            name: folderName,
            displayName: folderName, // 直接使用文件夹名称如 003, 004
            productImages: [],
            lookbookImages: [],
            virtualTryonImages: [],
            folder: folderName,
            gender: gender
        };

        // 定义每个文件夹可能包含的图片
        const possibleImages = await this.getImagesForFolder(folderName, gender);

        // 分类图片
        possibleImages.forEach(imageName => {
            // 跳过Thumbs.db文件
            if (imageName === 'Thumbs.db') return;

            const basePath = 'reblue_compare_lookbook';
            const imagePath = `${basePath}/${folderName}/${imageName}`;

            // 3254开头的文件作为产品图片（上装和下装）
            if (imageName.startsWith('3254')) {
                outfit.productImages.push({
                    name: imageName,
                    path: imagePath,
                    displayName: this.formatImageName(imageName)
                });
            }
            // upload开头的文件作为虚拟试穿图片
            else if (imageName.toLowerCase().startsWith('upload')) {
                console.log(`为${folderName}添加虚拟试穿图片: ${imageName}`);
                outfit.virtualTryonImages.push({
                    name: imageName,
                    path: imagePath,
                    displayName: this.formatImageName(imageName)
                });
            }
            // 其他图片（如003.jpg, 004.jpg等）作为lookbook图片
            else {
                outfit.lookbookImages.push({
                    name: imageName,
                    path: imagePath,
                    displayName: this.formatImageName(imageName)
                });
            }
        });

        // 调试：输出加载结果
        console.log(`${folderName} 加载完成:`, {
            productImages: outfit.productImages.length,
            lookbookImages: outfit.lookbookImages.length,
            virtualTryonImages: outfit.virtualTryonImages.length
        });

        return outfit;
    }

    async getImagesForFolder(folderName, gender = 'lookbook') {
        // 这里返回每个文件夹中的图片文件名
        // 在实际应用中，这些数据应该来自服务器或文件系统API

        // lookbook数据
        const lookbookFolderContents = {
            '003': [
                '003.jpg',
                '325436014M02.jpg',
                '325466004P17.jpg',
                'upload_003.jpg'
            ],
            '004': [
                '004.jpg',
                '325436015Z44.jpg',
                '325439019N02.jpg',
                'upload_004.jpg'
            ],
            '006': [
                '006.jpg',
                '325420001M08.jpg',
                '325439019N02.jpg',
                'upload_006.jpg'
            ],
            '015': [
                '015.jpg',
                '325406018B03.jpg',
                '325466032M10.jpg',
                '3254C2025B03.jpg',
                'ai-generated-1761374045129_无外套.jpg',
                'upload_015.jpg'
            ],
            '036': [
                '036.jpg',
                '325450031M10.jpg',
                '3254B4056P17.jpg',
                'upload_036.jpg'
            ],
            '040': [
                '040.jpg',
                '325466048P14.jpg',
                '3254D1040B15.jpg',
                'upload_040.jpg'
            ],
            '041': [
                '041.jpg',
                '325437061P16.jpg',
                '325466062P17.jpg',
                'ai-generated-1761375161451.jpg',
                'upload_041.jpg'
            ],
            '086': [
                '086.jpg',
                '325450085L16.jpg',
                '3254C0079L16.jpg',
                'upload_086.jpg'
            ],
            '176': [
                '176.jpg',
                '325435146B03.jpg',
                '325450131M01.jpg',
                'upload_176.jpg'
            ]
        };

        // 如果是lookbook类型，返回lookbook数据
        if (gender === 'lookbook') {
            return lookbookFolderContents[folderName] || [];
        }

        // 女装数据（保留旧数据以防需要）
        const womenFolderContents = {
            'RR2256120200': [
                '250618RARE0477.jpg',
                'RR2256120200.jpg',
                'RR2256410941.jpg',
                'UPLOAD_200.png',
                'UPLOAD_200_2.png',
                'UPLOAD_200_3.png',
            ],
            'RR2256120764': [
                '250618RARE1202.jpg',
                'RR2256120764.jpg',
                'RR2256250349.jpg',
                'RR2256420924.jpg',
                'UPLOAD_764.png',
                'UPLOAD_764_2.png',
                'UPLOAD_764_3.png',
            ],
            'RR2256130901A': [
                '250619RARE_7770.jpg',
                'RR1256410707.jpg',
                'RR2256130901A.jpg',
                'UPLOAD_901A.png',
                'UPLOAD_901A_2.png',
                'UPLOAD_901A_3.png',
            ],
            'RR2256160741': [
                '250618RARE1538.jpg',
                'RR2256160741.jpg',
                'RR2256210801.jpg',
                'RR2256410741.jpg',
                'UPLOAD_741.png',
                'UPLOAD_741_2.png',
                'UPLOAD_741_3.png',
            ],
            'RR2256160946A': [
                '250619RARE_6962.jpg',
                'RR2256160946A.jpg',
                'RR2256210719.jpg',
                'RR2256420708.jpg',
                'UPLOAD_946A.png',
                'UPLOAD_946A_2.png',
                'UPLOAD_946A_3.png',
            ],
            'RR2256162762': [
                '250619RARE_8159.jpg',
                'RR2256162762.jpg',
                'RR2256210955.jpg',
                'RR2256430762.jpg',
                'UPLOAD_762.png',
                'UPLOAD_762_2.png',
                'UPLOAD_762_3.png',
            ],
            'RR2256162973': [
                '250619RARE_8383.jpg',
                'RR2256162973.jpg',
                'RR2256420973.jpg',
                'UPLOAD_973.png',
                'UPLOAD_973_2.png',
                'UPLOAD_973_3.png',
            ],
            'RR2256241380B': [
                '250618RARE0419.jpg',
                '250618RARE0422.jpg',
                '250618RARE0424.jpg',
                'RR2256241380B.jpg',
                'RR2256410941.png',
                'UPLOAD_380B.png',
                'UPLOAD_380B_2.png',
                'UPLOAD_380B_3.png',
            ],
            'RR2256242361': [
                '250618RARE0001.jpg',
                'RR2256242361.jpg',
                'RR2256430938.jpg',
                'UPLOAD_361.png',
                'UPLOAD_361_2.png',
                'UPLOAD_361_3.png',
            ],
            'RR2256242382A': [
                '250619RARE_7081.jpg',
                'RR2256242382A.jpg',
                'RR2256410737.jpg',
                'UPLOAD_382A.png',
                'UPLOAD_382A_2.png',
                'UPLOAD_382A_3.png',
            ],
            'RR2256250313': [
                '250619RARE_7245.jpg',
                'RR2256250313.jpg',
                'RR2256281314.jpg',
                'RR2256410602.jpg',
                'UPLOAD_313.png',
                'UPLOAD_313_2.png',
                'UPLOAD_313_3.png',
            ],
            'RR2256250345': [
                '250618RARE0276.jpg',
                'RR2256250345.jpg',
                'RR2256464345.jpg',
                'UPLOAD_345.png',
                'UPLOAD_345_2.png',
                'UPLOAD_345_3.png',
            ],
            'RR2256250363B': [
                '250619RARE_8223.jpg',
                'RR2256250363B.jpg',
                'RR2256430363B.jpg',
                'UPLOAD_363B.png',
                'UPLOAD_363B_2.png',
                'UPLOAD_363B_3.png',
            ],
            'RR2256250383': [
                '250619RARE_7138.jpg',
                'RR2256250383.jpg',
                'RR2256410737.jpg',
                'UPLOAD_383.png',
                'UPLOAD_383_2.png',
                'UPLOAD_383_3.png',
            ],
        };

        // 男装数据
        const menFolderContents = {
            'RR1256120510': [
                '250614RARE6528.jpg',
                'RR1256120510.jpg',
                'RR1256230512.jpg',
                'RR1256420702.jpg',
                'UPLOAD_510.png',
                'UPLOAD_510_2.png',
                'UPLOAD_510_3.png',
            ],
            'RR1256150561': [
                '250614RARE3381.jpg',
                'RR1256150561.jpg',
                'RR1256410810.jpg',
                'UPLOAD_561.png',
                'UPLOAD_561_2.png',
                'UPLOAD_561_3.png',
            ],
            'RR1256160502': [
                '250614RARE4831.jpg',
                'RR1256160502.jpg',
                'RR1256230512.jpg',
                'RR1256420502.jpg',
                'UPLOAD_502.png',
                'UPLOAD_502_2.png',
                'UPLOAD_502_3.png',
            ],
            'RR1256162757': [
                '250614RARE4955.jpg',
                'RR1256162757.jpg',
                'RR1256241620B.jpg',
                'RR1256430757.jpg',
                'UPLOAD_757.png',
                'UPLOAD_757_2.png',
                'UPLOAD_757_3.png',
            ],
            'RR1256182517': [
                '250614RARE5893.jpg',
                'RR1256182517.jpg',
                'RR1256230512.jpg',
                'RR1256410757.jpg',
                'UPLOAD_517.png',
                'UPLOAD_517_2.png',
                'UPLOAD_517_3.png',
            ],
            'RR1256210608': [
                '250616RARE8271.jpg',
                'RR1256210608.jpg',
                'RR1256410757.jpg',
                'UPLOAD_608.png',
                'UPLOAD_608_2.png',
                'UPLOAD_608_3.png',
            ],
            'RR1256210610B': [
                '250614RARE3367.jpg',
                'RR1256210610B.jpg',
                'RR1256410810.jpg',
                'UPLOAD_610B.png',
                'UPLOAD_610B_2.png',
                'UPLOAD_610B_3.png',
            ],
            'RR1256220624A': [
                '250614RARE7267.jpg',
                'RR1256220624A.jpg',
                'RR1256430755.jpg',
                'UPLOAD_624A.png',
                'UPLOAD_624A_2.png',
                'UPLOAD_624A_3.png',
            ],
            'RR1256230512': [
                '250614RARE5164.jpg',
                'RR1256230512.jpg',
                'RR1256430757.jpg',
                'UPLOAD_512.png',
                'UPLOAD_512_2.png',
                'UPLOAD_512_3.png',
            ],
            'RR1256230630': [
                '250614RARE5983.jpg',
                'RR1256230630.jpg',
                'RR1256410757.jpg',
                'UPLOAD_630.png',
                'UPLOAD_630_2.png',
                'UPLOAD_630_3.png',
            ],
            'RR1256261513B': [
                '250614RARE2759.jpg',
                'RR0000000002.jpg',
                'RR1256261513B.jpg',
                'UPLOAD_513B.png',
                'UPLOAD_513B_2.png',
                'UPLOAD_513B3.png',
            ],
            'RR1256261525': [
                '250614RARE6138.jpg',
                'RR1256210610A.jpg',
                'RR1256261525.jpg',
                'RR1256410810.jpg',
                'UPLOAD_525.png',
                'UPLOAD_525_2.png',
                'UPLOAD_525_3.png',
            ],
        };

        // 根据性别返回对应的数据
        const folderContents = gender === 'men' ? menFolderContents : womenFolderContents;
        return folderContents[folderName] || [];
    }

    formatDisplayName(folderName) {
        // 格式化显示名称
        const cleanName = folderName.replace(/_.*$/, '');
        return cleanName;
    }

    formatImageName(imageName) {
        // 格式化图片名称
        return imageName.replace(/\.(jpg|jpeg|png)$/i, '');
    }

    switchGender(gender) {
        if (this.currentGender === gender) return;
        
        this.currentGender = gender;
        this.outfitData = this.allOutfitData[gender];
        
        // 更新UI
        this.updateGenderButtons();
        this.renderOutfitDropdown();
        this.clearSelection();
        
        console.log(`切换到${gender === 'men' ? '男装' : '女装'}系列`);
    }

    updateGenderButtons() {
        const womenBtn = document.getElementById('womenBtn');
        const menBtn = document.getElementById('menBtn');
        
        if (womenBtn && menBtn) {
            womenBtn.classList.toggle('active', this.currentGender === 'women');
            menBtn.classList.toggle('active', this.currentGender === 'men');
        }
    }

    renderOutfitDropdown() {
        const dropdown = document.getElementById('outfitSelect');
        if (!dropdown) return;

        // 清空现有选项（保留第一个占位符选项）
        dropdown.innerHTML = '<option value="">请选择套装...</option>';

        // 添加套装选项
        this.outfitData.forEach(outfit => {
            const option = document.createElement('option');
            option.value = outfit.id;
            option.textContent = outfit.displayName;
            dropdown.appendChild(option);
        });
    }

    selectOutfit(outfit) {
        this.currentOutfit = outfit;
        this.currentProductImage = 0;
        this.currentLookbookImage = 0;
        this.currentVirtualImage = 0;
        this.currentVirtualTryonIndex = 0; // 重置虚拟试穿图片索引

        this.updateImageDisplays();
        this.updateVirtualTryonInterface();
    }

    selectOutfitById(outfitId) {
        const outfit = this.outfitData.find(o => o.id === outfitId);
        if (outfit) {
            this.selectOutfit(outfit);
        }
    }

    updateImageDisplays() {
        console.log('updateImageDisplays: 开始更新所有图片显示');
        if (!this.currentOutfit) {
            console.log('updateImageDisplays: 无当前套装');
            return;
        }

        console.log('updateImageDisplays: 当前套装:', this.currentOutfit.name);
        console.log('updateImageDisplays: 产品图片数量:', this.currentOutfit.productImages?.length);
        console.log('updateImageDisplays: lookbook图片数量:', this.currentOutfit.lookbookImages?.length);

        // 强制刷新所有图片显示
        this.updateProductImages();
        this.updateLookbookImages();
        
        console.log('updateImageDisplays: 图片显示更新完成');
    }

    updateProductImages() {
        const container = document.getElementById('productImage');
        const thumbnailsContainer = document.getElementById('productThumbnails');
        
        if (!container || !thumbnailsContainer) return;

        const images = this.currentOutfit.productImages;
        
        if (images.length === 0) {
            container.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-icon">BOX</div>
                    <p>此套装暂无单品图</p>
                </div>
            `;
            thumbnailsContainer.innerHTML = '';
            return;
        }

        // 显示主图
        const currentImage = images[this.currentProductImage];
        const genderClass = this.currentGender === 'men' ? ' mens-image' : '';
        container.innerHTML = `
            <img src="${currentImage.path}" alt="${currentImage.displayName}" class="main-image${genderClass}" onerror="this.style.display='none'">
        `;

        // 为主图添加点击事件
        const mainImage = container.querySelector('.main-image');
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                this.openModal(images, this.currentProductImage);
            });
        }

        // 显示缩略图
        this.renderThumbnails(thumbnailsContainer, images, this.currentProductImage, (index) => {
            this.currentProductImage = index;
            this.updateProductImages();
        });
    }

    updateLookbookImages() {
        console.log('updateLookbookImages: 开始更新lookbook图片');
        const container = document.getElementById('lookbookImage');
        const thumbnailsContainer = document.getElementById('lookbookThumbnails');
        
        if (!container || !thumbnailsContainer) {
            console.error('updateLookbookImages: 未找到lookbook容器元素');
            return;
        }

        if (!this.currentOutfit) {
            console.log('updateLookbookImages: 无当前套装');
            return;
        }

        const images = this.currentOutfit.lookbookImages;
        console.log('updateLookbookImages: lookbook图片数组:', images);
        
        if (images.length === 0) {
            console.log('updateLookbookImages: 无lookbook图片，显示占位符');
            container.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-icon">CAMERA</div>
                    <p>此套装暂无产品实拍</p>
                </div>
            `;
            thumbnailsContainer.innerHTML = '';
            return;
        }

        // 显示主图
        const currentImage = images[this.currentLookbookImage];
        console.log('updateLookbookImages: 当前显示图片:', currentImage);
        
        const genderClass = this.currentGender === 'men' ? ' mens-image' : '';
        const imgHTML = `<img src="${currentImage.path}" alt="${currentImage.displayName}" class="main-image${genderClass}" onerror="this.style.display='none'; console.error('lookbook图片加载失败: ${currentImage.path}')">`;
        
        console.log('updateLookbookImages: 设置HTML:', imgHTML);
        container.innerHTML = imgHTML;

        // 为主图添加点击事件
        const mainImage = container.querySelector('.main-image');
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                this.openModal(images, this.currentLookbookImage);
            });
            console.log('updateLookbookImages: 已添加点击事件');
        }

        // 显示缩略图
        this.renderThumbnails(thumbnailsContainer, images, this.currentLookbookImage, (index) => {
            this.currentLookbookImage = index;
            this.updateLookbookImages();
        });
        
        console.log('updateLookbookImages: lookbook图片更新完成');
    }

    updateVirtualTryonInterface() {
        if (!this.currentOutfit) return;

        const placeholderElement = document.getElementById('virtualPlaceholder');
        const generateSection = document.getElementById('generateSection');
        const loadingContainer = document.getElementById('loadingContainer');
        const virtualResult = document.getElementById('virtualResult');

        // 重置所有状态
        this.hideAllVirtualSections();

        // 调试：打印当前套装的虚拟试穿图片信息
        console.log('当前套装:', this.currentOutfit.name);
        console.log('虚拟试穿图片数量:', this.currentOutfit.virtualTryonImages.length);
        console.log('虚拟试穿图片:', this.currentOutfit.virtualTryonImages);

        // 如果有虚拟试穿图片，显示生成按钮
        if (this.currentOutfit.virtualTryonImages.length > 0) {
            console.log('显示生成按钮');
            generateSection.style.display = 'flex';
        } else {
            // 没有虚拟试穿图片时显示占位符
            console.log('显示占位符');
            placeholderElement.style.display = 'flex';
            const placeholderContent = placeholderElement.querySelector('.placeholder-content p');
            placeholderContent.textContent = '此套装暂无虚拟试穿数据';
        }
    }

    hideAllVirtualSections() {
        document.getElementById('virtualPlaceholder').style.display = 'none';
        document.getElementById('generateSection').style.display = 'none';
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('virtualResult').style.display = 'none';
    }

    async generateVirtualTryon() {
        console.log('generateVirtualTryon: 开始生成虚拟试穿');
        console.log('generateVirtualTryon: isGenerating:', this.isGenerating);
        console.log('generateVirtualTryon: currentOutfit:', this.currentOutfit?.name);
        console.log('generateVirtualTryon: virtualTryonImages length:', this.currentOutfit?.virtualTryonImages?.length);
        
        if (this.isGenerating || !this.currentOutfit || this.currentOutfit.virtualTryonImages.length === 0) {
            console.log('generateVirtualTryon: 退出条件触发 - isGenerating:', this.isGenerating, 'currentOutfit:', !!this.currentOutfit, 'images:', this.currentOutfit?.virtualTryonImages?.length);
            return;
        }

        this.isGenerating = true;
        console.log('generateVirtualTryon: 设置isGenerating = true');
        
        this.hideAllVirtualSections();
        console.log('generateVirtualTryon: 隐藏所有虚拟试穿区域');
        
        // 显示加载动画
        const loadingContainer = document.getElementById('loadingContainer');
        loadingContainer.style.display = 'flex';
        console.log('generateVirtualTryon: 显示加载动画');
        
        // 启动进度条动画
        this.startProgressAnimation();
        console.log('generateVirtualTryon: 启动进度条动画');
        
        // 模拟5秒生成过程
        setTimeout(() => {
            console.log('generateVirtualTryon: 5秒后开始显示结果');
            // 显示当前索引的图片
            this.showVirtualResult();
            this.isGenerating = false;
            console.log('generateVirtualTryon: 设置isGenerating = false');
            // 确保lookbook图片继续显示
            this.ensureLookbookDisplayed();
        }, 5000);
    }

    async regenerateVirtualTryon() {
        if (this.isGenerating || !this.currentOutfit || this.currentOutfit.virtualTryonImages.length === 0) {
            console.log('regenerateVirtualTryon: 退出 - isGenerating:', this.isGenerating, 'currentOutfit:', !!this.currentOutfit, 'images length:', this.currentOutfit?.virtualTryonImages?.length);
            return;
        }

        // 移动到下一张图片（循环）
        const totalImages = this.currentOutfit.virtualTryonImages.length;
        const previousIndex = this.currentVirtualTryonIndex;
        this.currentVirtualTryonIndex = (this.currentVirtualTryonIndex + 1) % totalImages;
        
        console.log('regenerateVirtualTryon: 索引变化', previousIndex, '->', this.currentVirtualTryonIndex, '总图片数:', totalImages);
        console.log('regenerateVirtualTryon: 当前图片数组:', this.currentOutfit.virtualTryonImages.map(img => img.name));

        this.isGenerating = true;
        this.hideAllVirtualSections();
        
        // 显示加载动画
        const loadingContainer = document.getElementById('loadingContainer');
        loadingContainer.style.display = 'flex';
        
        // 启动进度条动画
        this.startProgressAnimation();
        
        // 模拟5秒生成过程
        setTimeout(() => {
            // 显示新的图片
            console.log('regenerateVirtualTryon: 5秒后显示结果，当前索引:', this.currentVirtualTryonIndex);
            this.showVirtualResult();
            this.isGenerating = false;
            // 确保lookbook图片继续显示
            this.ensureLookbookDisplayed();
        }, 5000);
    }

    startProgressAnimation() {
        const progressFill = document.getElementById('progressFill');
        if (!progressFill) return;

        progressFill.style.width = '0%';
        
        // 5秒内从0%到100%
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2; // 每100ms增加2%，5秒完成
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }

    showVirtualResult() {
        console.log('showVirtualResult: 开始显示虚拟试穿结果');
        this.hideAllVirtualSections();
        
        const virtualResult = document.getElementById('virtualResult');
        if (virtualResult) {
            virtualResult.style.display = 'flex';
            console.log('showVirtualResult: 已显示virtualResult区域');
        } else {
            console.error('showVirtualResult: 未找到virtualResult元素');
        }
        
        console.log('showVirtualResult: 调用updateVirtualImages');
        this.updateVirtualImages();
        
        // 确保lookbook图片保持显示
        console.log('showVirtualResult: 调用ensureLookbookDisplayed');
        this.ensureLookbookDisplayed();
        console.log('showVirtualResult: 完成显示虚拟试穿结果');
    }

    ensureLookbookDisplayed() {
        // 如果有当前套装，确保lookbook图片正确显示
        if (this.currentOutfit) {
            console.log('ensureLookbookDisplayed: 重新确保lookbook图片显示');
            console.log('ensureLookbookDisplayed: 当前套装:', this.currentOutfit.name);
            console.log('ensureLookbookDisplayed: lookbook图片数量:', this.currentOutfit.lookbookImages?.length);
            
            // 强制重新渲染lookbook图片
            this.updateLookbookImages();
            
            // 同时确保产品图片也保持显示
            this.updateProductImages();
            
            // 延迟验证确保图片显示成功
            setTimeout(() => {
                const lookbookContainer = document.getElementById('lookbookImage');
                if (lookbookContainer && this.currentOutfit.lookbookImages.length > 0) {
                    const img = lookbookContainer.querySelector('.main-image');
                    if (!img) {
                        console.warn('ensureLookbookDisplayed: 验证失败，重新尝试显示lookbook图片');
                        this.updateLookbookImages();
                    } else {
                        console.log('ensureLookbookDisplayed: 验证成功，lookbook图片正常显示');
                    }
                }
            }, 500);
        }
    }

    updateVirtualImages() {
        const container = document.getElementById('virtualImage');
        
        if (!container || !this.currentOutfit) {
            console.log('updateVirtualImages: container或currentOutfit为空');
            return;
        }

        const images = this.currentOutfit.virtualTryonImages;
        console.log('updateVirtualImages: 虚拟试穿图片数组', images);
        
        if (images.length === 0) {
            console.log('updateVirtualImages: 没有虚拟试穿图片');
            return;
        }

        // 按文件名排序确保顺序一致
        const sortedImages = [...images].sort((a, b) => a.name.localeCompare(b.name));
        
        // 获取当前索引的图片
        const currentImage = sortedImages[this.currentVirtualTryonIndex];
        console.log('updateVirtualImages: 当前显示图片索引', this.currentVirtualTryonIndex, '图片:', currentImage);
        console.log('updateVirtualImages: sortedImages数组:', sortedImages);
        
        if (!currentImage) {
            console.error('updateVirtualImages: currentImage为空! 索引:', this.currentVirtualTryonIndex, '数组长度:', sortedImages.length);
            return;
        }
        
        const genderClass = this.currentGender === 'men' ? ' mens-image' : '';
        const imgHTML = `<img src="${currentImage.path}" alt="${currentImage.displayName}" class="main-image${genderClass}" onerror="this.style.display='none'; console.log('图片加载失败: ${currentImage.path}')">`;
        
        console.log('updateVirtualImages: 准备设置的HTML:', imgHTML);
        container.innerHTML = imgHTML;

        console.log('updateVirtualImages: 已设置图片HTML');
        
        // 验证HTML是否真的设置成功
        setTimeout(() => {
            const img = container.querySelector('.main-image');
            if (img) {
                console.log('updateVirtualImages: 验证 - 图片元素已创建:', img.src);
            } else {
                console.error('updateVirtualImages: 验证 - 图片元素未找到!');
            }
        }, 100);

        // 为虚拟试穿图片添加点击事件
        const mainImage = container.querySelector('.main-image');
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                this.openModal([currentImage], 0);
            });
        }
    }


    renderThumbnails(container, images, currentIndex, onSelect) {
        container.innerHTML = '';

        images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.path;
            thumbnail.alt = image.displayName;
            thumbnail.className = `thumbnail ${index === currentIndex ? 'active' : ''}`;
            thumbnail.title = image.displayName;
            
            thumbnail.addEventListener('click', () => onSelect(index));
            
            thumbnail.onerror = function() {
                this.style.display = 'none';
            };

            container.appendChild(thumbnail);
        });
    }


    bindEvents() {
        // 性别选择按钮事件
        const womenBtn = document.getElementById('womenBtn');
        const menBtn = document.getElementById('menBtn');
        
        if (womenBtn) {
            womenBtn.addEventListener('click', () => {
                this.switchGender('women');
            });
        }
        
        if (menBtn) {
            menBtn.addEventListener('click', () => {
                this.switchGender('men');
            });
        }

        // 下拉菜单事件
        const dropdown = document.getElementById('outfitSelect');
        if (dropdown) {
            dropdown.addEventListener('change', (e) => {
                const outfitId = e.target.value;
                if (outfitId) {
                    this.selectOutfitById(outfitId);
                } else {
                    this.clearSelection();
                }
            });
        }

        // 虚拟试穿生成按钮
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateVirtualTryon();
            });
        }

        // 重新生成按钮
        const regenerateBtn = document.getElementById('regenerateBtn');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => {
                // 循环到下一张图片
                this.regenerateVirtualTryon();
            });
        }

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (!this.currentOutfit) return;

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateImages('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateImages('next');
                    break;
                case 'Escape':
                    this.clearSelection();
                    break;
            }
        });

        // 图片懒加载
        this.setupLazyLoading();

        // 绑定图片模态框事件
        this.bindModalEvents();
    }

    bindModalEvents() {
        const modal = document.getElementById('imageModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');

        this.currentModalImages = [];
        this.currentModalIndex = 0;

        // 关闭模态框
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // 模态框键盘导航 - 使用不同的键盘事件避免冲突
        document.addEventListener('keydown', (e) => {
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeModal();
                } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
                    e.preventDefault();
                    this.showPrevModalImage();
                } else if (e.key === 'ArrowRight' && e.ctrlKey) {
                    e.preventDefault();
                    this.showNextModalImage();
                }
            }
        });

        // 导航按钮
        if (modalPrev) {
            modalPrev.addEventListener('click', () => {
                this.showPrevModalImage();
            });
        }

        if (modalNext) {
            modalNext.addEventListener('click', () => {
                this.showNextModalImage();
            });
        }
    }

    openModal(images, currentIndex = 0) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');

        this.currentModalImages = images;
        this.currentModalIndex = currentIndex;

        if (images.length > 0) {
            modalImage.src = images[currentIndex].path;
            modal.classList.add('active');
            this.updateModalNavigation();
            // 阻止背景滚动
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('active');
        // 恢复背景滚动
        document.body.style.overflow = '';
    }

    showPrevModalImage() {
        if (this.currentModalImages.length > 1) {
            this.currentModalIndex = (this.currentModalIndex - 1 + this.currentModalImages.length) % this.currentModalImages.length;
            this.updateModalImage();
        }
    }

    showNextModalImage() {
        if (this.currentModalImages.length > 1) {
            this.currentModalIndex = (this.currentModalIndex + 1) % this.currentModalImages.length;
            this.updateModalImage();
        }
    }

    updateModalImage() {
        const modalImage = document.getElementById('modalImage');
        if (this.currentModalImages[this.currentModalIndex]) {
            modalImage.src = this.currentModalImages[this.currentModalIndex].path;
            this.updateModalNavigation();
        }
    }

    updateModalNavigation() {
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');

        if (modalPrev && modalNext) {
            modalPrev.style.display = this.currentModalImages.length > 1 ? 'flex' : 'none';
            modalNext.style.display = this.currentModalImages.length > 1 ? 'flex' : 'none';
        }
    }

    navigateImages(direction) {
        if (!this.currentOutfit) return;

        const productImages = this.currentOutfit.productImages;
        const lookbookImages = this.currentOutfit.lookbookImages;

        if (direction === 'next') {
            if (this.currentProductImage < productImages.length - 1) {
                this.currentProductImage++;
                this.updateProductImages();
            } else if (this.currentLookbookImage < lookbookImages.length - 1) {
                this.currentLookbookImage++;
                this.updateLookbookImages();
            }
        } else if (direction === 'prev') {
            if (this.currentProductImage > 0) {
                this.currentProductImage--;
                this.updateProductImages();
            } else if (this.currentLookbookImage > 0) {
                this.currentLookbookImage--;
                this.updateLookbookImages();
            }
        }
    }

    clearSelection() {
        this.currentOutfit = null;
        this.currentVirtualImage = 0;
        this.currentVirtualTryonIndex = 0; // 重置虚拟试穿图片索引
        this.isGenerating = false;
        
        // 重置下拉菜单
        const dropdown = document.getElementById('outfitSelect');
        if (dropdown) {
            dropdown.value = '';
        }

        
        // 重置图片显示
        this.resetImageContainers();
        
        // 重置虚拟试穿界面
        this.resetVirtualTryonInterface();
    }

    resetVirtualTryonInterface() {
        console.log('resetVirtualTryonInterface: 重置虚拟试穿界面');
        this.hideAllVirtualSections();
        const placeholderElement = document.getElementById('virtualPlaceholder');
        if (placeholderElement) {
            placeholderElement.style.display = 'flex';
            const placeholderContent = placeholderElement.querySelector('.placeholder-content p');
            placeholderContent.textContent = '选择套装开始虚拟试穿';
            console.log('resetVirtualTryonInterface: 已显示默认占位符');
        } else {
            console.error('resetVirtualTryonInterface: 未找到virtualPlaceholder元素');
        }
    }

    resetImageContainers() {
        const containers = [
            { id: 'productImage', icon: 'BOX', text: '选择套装查看单品图' },
            { id: 'lookbookImage', icon: 'CAMERA', text: '选择套装查看产品实拍' }
        ];

        containers.forEach(({ id, icon, text }) => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="placeholder-content">
                        <div class="placeholder-icon">${icon}</div>
                        <p>${text}</p>
                    </div>
                `;
            }
        });

        // 清空缩略图
        ['productThumbnails', 'lookbookThumbnails'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = '';
        });
    }

    setupLazyLoading() {
        // 图片懒加载优化
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    showError(message) {
        // 简单的错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(255, 71, 87, 0.3);
            z-index: 1001;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new RareCompare();
    
    // 全局错误处理
    window.addEventListener('error', (e) => {
        console.error('应用错误:', e);
    });
    
    // 导出到全局作用域以便调试
    window.rareCompare = app;
});
