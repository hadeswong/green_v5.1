class CardManager {
    // 显示所有卡片
    showAllCards() {
        this.cards.forEach(card => {
            card.style.display = 'block';
        });
    }

    constructor() {
        this.cards = document.querySelectorAll('.card-container');
        this.container = document.querySelector('.cards-container');
        this.filterIcons = document.querySelectorAll('.filter-icon');
        this.showAllCards();
        this.initializeFilters();
        this.initializeCards();
        this.setupAutoReset();
    }

    initializeFilters() {
        this.filterIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                // 移除所有图标的active类
                this.filterIcons.forEach(i => i.classList.remove('active'));
                // 为当前点击的图标添加active类
                icon.classList.add('active');
                
                const filter = icon.getAttribute('data-filter');
                this.filterCards(filter);
            });
        });
    }

    filterCards(filter) {
        this.cards.forEach(card => {
            const cardType = card.querySelector('.card-type').textContent.trim();
            
            // 重置所有卡片的显示状态
            card.style.display = 'none';
            
            // 根据筛选条件显示卡片
            if (filter === 'all') {
                card.style.display = 'block';
                // 显示所有分隔线
                document.querySelectorAll('hr').forEach(hr => {
                    hr.style.display = 'block';
                });
            } else {
                if (filter === 'phone' && cardType.startsWith('電話')) {
                    card.style.display = 'block';
                } else if (filter === 'physical' && cardType === '實體卡') {
                    card.style.display = 'block';
                } else if (filter === 'physical2' && cardType === '實體卡2') {
                    card.style.display = 'block';
                } else if (filter === 'physical3' && cardType === '新實體卡') {
                    card.style.display = 'block';
                }
                // 隐藏所有分隔线
                document.querySelectorAll('hr').forEach(hr => {
                    hr.style.display = 'none';
                });
            }
        });
    }

    initializeCards() {
        this.cards.forEach((cardContainer) => {
            const header = cardContainer.querySelector('.member-header');
            const contentWrapper = cardContainer.querySelector('.card-content-wrapper');
            const recycleCheck = cardContainer.querySelector('.recycleCheck');
            const alert = cardContainer.querySelector('.alert');
            const greenCard = cardContainer.querySelector('.green-card-container');
            const memberId = header.getAttribute('data-member-id');

            // 點擊 header 時展開/收起內容
            header.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止觸發卡片的點擊事件
                // 收起其他所有卡片
                this.cards.forEach(otherCard => {
                    if (otherCard !== cardContainer) {
                        const otherWrapper = otherCard.querySelector('.card-content-wrapper');
                        otherWrapper.classList.remove('expanded');
                        otherCard.classList.remove('expanded');
                    }
                });
            
                // 切換當前卡片
                contentWrapper.classList.toggle('expanded');
                cardContainer.classList.toggle('expanded');
                
                if (contentWrapper.classList.contains('expanded')) {
                    // 確保展開的卡片可見
                    setTimeout(() => {
                        this.centerCard(cardContainer);
                    }, 300);
                }
            });

            recycleCheck.addEventListener('change', (e) => {
                e.stopPropagation(); // 防止觸發卡片的點擊事件
                this.updateCardStatus(recycleCheck.checked, alert, greenCard);
                this.saveCardStatus(memberId, recycleCheck.checked);
            });

            this.initializeCardStatus(memberId, recycleCheck, alert, greenCard);
        });
    }

    // 更新卡片是否完成廚餘回收
    updateCardStatus(isChecked, alert, greenCard) {
        const header = alert.closest('.member-header');
        if (isChecked) {
            alert.textContent = '✅ 已完成廚餘回收';
            header.classList.add('completed');
            greenCard.classList.add('completed');
        } else {
            alert.textContent = '❌ 未完成廚餘回收';
            header.classList.remove('completed');
            greenCard.classList.remove('completed');
        }
    }

    // 保存卡片狀態
    saveCardStatus(memberId, status) {
        const today = new Date().toLocaleDateString();
        localStorage.setItem(`recycleStatus-${memberId}`, status);
        localStorage.setItem(`recycleDate-${memberId}`, today);
    }

    // 初始化卡片狀態
    initializeCardStatus(memberId, recycleCheck, alert, greenCard) {
        const today = new Date().toLocaleDateString();
        const savedDate = localStorage.getItem(`recycleDate-${memberId}`);
        const savedStatus = localStorage.getItem(`recycleStatus-${memberId}`);

        if (savedDate !== today) {
            recycleCheck.checked = false;
            this.updateCardStatus(false, alert, greenCard);
            this.saveCardStatus(memberId, false);
        } else {
            const status = savedStatus === 'true';
            recycleCheck.checked = status;
            this.updateCardStatus(status, alert, greenCard);
        }
    }

    // 重置所有卡片
    resetAllCards() {
        this.cards.forEach((card) => {
            const memberId = card.querySelector('.member-header').getAttribute('data-member-id');
            const recycleCheck = card.querySelector('.recycleCheck');
            const alert = card.querySelector('.alert');
            const greenCard = card.querySelector('.green-card-container');
            
            recycleCheck.checked = false;
            this.updateCardStatus(false, alert, greenCard);
            this.saveCardStatus(memberId, false);
        });
    }

    // 設置時間自動重置
    setupAutoReset() {
        const checkDate = () => {
            const today = new Date().toLocaleDateString();
            const lastResetDate = localStorage.getItem('lastResetDate');
            
            if (lastResetDate !== today) {
                this.resetAllCards();
                localStorage.setItem('lastResetDate', today);
            }
        };
        checkDate();
        setInterval(checkDate, 60000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new CardManager();
}); 