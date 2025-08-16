import IdeaApi from '../services/ideasApi';

class IdeaList {
    constructor() {
        this._ideaListEl = document.querySelector('#idea-list');
        this._ideas = [];
        this.getIdeas();

        this._validTags = new Set();
        this._validTags.add('technology');
        this._validTags.add('software');
        this._validTags.add('business');
        this._validTags.add('education');
        this._validTags.add('health');
        this._validTags.add('inventions');
    }

    formatDate(isoString) {
        const date = new Date(isoString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${year}-${month}-${day} ${hours}:${minutes}${ampm.toLowerCase()}`;
    }

    addEventListeners() {
        this._ideaListEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-times')) {
                e.stopImmediatePropagation();
                const ideaId = e.target.parentElement.parentElement.dataset.id;
                this.deleteId(ideaId);
            }
        });
    }

    async getIdeas() {
        try {
            const res = await IdeaApi.getIdeas();
            this._ideas = res.data.data;
            this.render();
            console.log(this._ideas);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteId(ideaId) {
        try {
            // Delete from server
            const res = await IdeaApi.deleteIdea(ideaId);
            this._ideas.filter((idea) => idea._id !== ideaId);
            this.getIdeas();
        } catch (error) {
            alert('You can not delete this resource');
        }
    }

    addIdeaToList(idea) {
        this._ideas.push(idea);
        this.render();
    }

    getTagClass(tag) {
        tag = tag.toLowerCase();
        let tagClass = '';
        if (this._validTags.has(tag)) {
            tagClass = `tag-${tag}`;
        } else {
            tagClass = '';
        }
        return tagClass;
    }

    render() {
        this._ideaListEl.innerHTML = this._ideas
            .map((idea) => {
                const tagClass = this.getTagClass(idea.tag);
                const deleteBtn =
                    idea.username === localStorage.getItem('username')
                        ? `<button class="delete"><i class="fas fa-times"></i></button>`
                        : '';
                const formattedDate = this.formatDate(idea.date);

                return `
                    <div class="card" data-id="${idea._id}">
                        ${deleteBtn}
                        <h3>
                            ${idea.text}
                        </h3>
                        <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
                        <p>
                            Posted on <span class="date">${formattedDate}</span> by
                            <span class="author">${idea.username}</span>
                        </p>
                    </div>
                `;
            })
            .join('');
        this.addEventListeners();
    }
}

export default IdeaList;
