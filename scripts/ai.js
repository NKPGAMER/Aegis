import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const assistant = {
    active: false,
    currentPlayer: null,
    functions: [],

    subscribe: function(key, response, run) {
        this.functions.push({ key, response, run });
    },

    processMessage: function(message) {
        const lowercaseMessage = message.toLowerCase();
        
        if (lowercaseMessage.includes("aegis") && !this.active) {
            this.active = true;
            this.currentPlayer.sendMessage("Xin chào! Tôi là Aegis. Tôi có thể giúp gì cho bạn?");
            return;
        }

        if (this.active) {
            if (lowercaseMessage.includes("dừng") || lowercaseMessage.includes("thoát aegis")) {
                this.active = false;
                this.currentPlayer.sendMessage("Tạm biệt! Hẹn gặp lại bạn sau.");
                this.currentPlayer = null;
                return;
            }

            for (const func of this.functions) {
                if (this.calculateProbability(lowercaseMessage, func.key)) {
                    const args = this.extractArgs(lowercaseMessage, func.key);
                    func.run(args);
                    const response = func.response[Math.floor(Math.random() * func.response.length)];
                    this.currentPlayer.sendMessage(response);
                    return;
                }
            }

            this.currentPlayer.sendMessage("Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể nói rõ hơn được không?");
        }
    },

    calculateProbability: function(message, key) {
        // Đây là một hàm đơn giản để tính xác suất. Trong thực tế, bạn sẽ cần một thuật toán phức tạp hơn.
        const keywords = key.split(' ');
        let matchCount = 0;
        for (const word of keywords) {
            if (message.includes(word)) matchCount++;
        }
        return matchCount / keywords.length > 0.5;
    },

    extractArgs: function(message, key) {
        // Hàm này sẽ trích xuất các đối số từ tin nhắn
        // Ví dụ: từ "đổi thời tiết thành mưa", nó sẽ trích xuất "mưa"
        const keywordIndex = message.indexOf(key);
        if (keywordIndex !== -1) {
            return message.slice(keywordIndex + key.length).trim().split(' ');
        }
        return [];
    }
};

// Đăng ký các chức năng
assistant.subscribe("thời tiết", 
    ["Đã thay đổi thời tiết theo yêu cầu của bạn.", "Thời tiết đã được cập nhật."],
    (args) => {
        const weatherMap = { "mưa": "rain", "nắng": "clear", "sấm sét": "thunder" };
        const weather = weatherMap[args[0]] || "clear";
        world.getDimension("overworld").runCommand(`weather ${weather}`);
    }
);

assistant.subscribe("thời gian", 
    ["Đã thay đổi thời gian theo yêu cầu của bạn.", "Thời gian đã được cập nhật."],
    (args) => {
        const timeMap = { "sáng": "day", "trưa": "noon", "chiều": "sunset", "tối": "night", "nửa đêm": "midnight" };
        const time = timeMap[args[0]] || "day";
        world.getDimension("overworld").runCommandAsync(`time set ${time}`);
        Aegis.sendMessage(args[0])
       
    }
);

assistant.subscribe("teleport", 
    ["Đã dịch chuyển bạn đến vị trí mới.", "Bạn đã được dịch chuyển."],
    (args) => {
        const [x, y, z] = args.map(Number);
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            assistant.currentPlayer.teleport({x, y, z});
        }
    }
);

// Lắng nghe sự kiện chat
world.beforeEvents.chatSend.subscribe((eventData) => {
    const player = eventData.sender;
    const message = eventData.message;

    assistant.currentPlayer = player;
    assistant.processMessage(message);
});

system.runInterval(() => {
    // Có thể thêm logic xử lý định kỳ ở đây nếu cần
}, 20);